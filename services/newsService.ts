import {News,Page} from '@/lib/types';
const j=async(p:Promise<Response>)=>{const r=await p;if(!r.ok){let m=`HTTP ${r.status}`;try{m=JSON.parse(await r.text()).error||m}catch{}throw new Error(m)}return r.json()};
const h=(t?:string|null)=>({'Content-Type':'application/json',...(t?{Authorization:`Bearer ${t}`}:{})});
export const fetchNews=(p:Record<string,string>,token?:string|null):Promise<Page>=>j(fetch('/api/news?'+new URLSearchParams(p),{headers:h(token)}));
export const fetchOne=(id:string):Promise<News>=>j(fetch('/api/news/'+id));
export const createNews=(b:Partial<News>,t:string|null)=>j(fetch('/api/news',{method:'POST',headers:h(t),body:JSON.stringify(b)}));
export const updateNews=(id:string,b:Partial<News>,t:string|null)=>j(fetch('/api/news/'+id,{method:'PUT',headers:h(t),body:JSON.stringify(b)}));
export const deleteNews=(id:string,t:string|null)=>j(fetch('/api/news/'+id,{method:'DELETE',headers:h(t)}));
export const login=(b:{email:string;password:string})=>j(fetch('/api/login',{method:'POST',headers:h(),body:JSON.stringify(b)}));
