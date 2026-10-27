import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {RootState} from '@/lib/store';
import * as s from '@/services/newsService';
import {toast} from '@/components/Providers';
export const useNewsList=(p:Record<string,string>)=>useQuery({queryKey:['news',p],queryFn:()=>s.fetchNews(p),placeholderData:d=>d,retry:1});
export const useNewsDetail=(id:string)=>useQuery({queryKey:['news',id],queryFn:()=>s.fetchOne(id)});
export const useAdminList=()=>{const t=useSelector((x:RootState)=>x.auth.token);
 return useQuery({queryKey:['admin-news'],queryFn:()=>s.fetchNews({admin:'1',limit:'500'},t),enabled:!!t})};
export function useAdminMutations(){const qc=useQueryClient(),t=useSelector((x:RootState)=>x.auth.token);
 const done=(m:string)=>()=>{toast(m);qc.invalidateQueries({queryKey:['admin-news']});qc.invalidateQueries({queryKey:['news']})};
 const err=(e:Error)=>toast(e.message,'error');
 return{create:useMutation({mutationFn:(b:any)=>s.createNews(b,t),onSuccess:done('خبر ساخته شد'),onError:err}),
  update:useMutation({mutationFn:({id,...b}:any)=>s.updateNews(id,b,t),onSuccess:done('خبر ویرایش شد'),onError:err}),
  remove:useMutation({mutationFn:(id:string)=>s.deleteNews(id,t),onSuccess:done('خبر حذف شد'),onError:err})}}
