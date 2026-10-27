'use client';
import {Provider,useDispatch,useSelector} from 'react-redux';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {useEffect,useState} from 'react';
import {store,A,B,T,RootState} from '@/lib/store';
export const toast=(msg:string,type:'ok'|'error'='ok')=>window.dispatchEvent(new CustomEvent('toast',{detail:{msg,type}}));
function Toasts(){const[l,setL]=useState<{id:number;msg:string;type:string}[]>([]);
 useEffect(()=>{const f=(e:any)=>{const id=Date.now()+Math.random();setL(x=>[...x,{id,...e.detail}]);setTimeout(()=>setL(x=>x.filter(t=>t.id!==id)),3000)};
  window.addEventListener('toast',f);return()=>window.removeEventListener('toast',f)},[]);
 return<div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">{l.map(t=><div key={t.id} className={`rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${t.type==='error'?'bg-red-600':'bg-green-600'}`}>{t.msg}</div>)}</div>}
function Sync(){const d=useDispatch(),auth=useSelector((s:RootState)=>s.auth),bm=useSelector((s:RootState)=>s.bookmarks.items),mode=useSelector((s:RootState)=>s.theme.mode);
 useEffect(()=>{try{const r=JSON.parse(localStorage.getItem('rn')||'{}');d(A.hydrate(r.auth));if(r.bookmarks)d(B.hydrate(r.bookmarks));if(r.theme)d(T.hydrate(r.theme))}catch{d(A.hydrate(undefined))}},[d]);
 useEffect(()=>{if(!auth.ready)return;document.documentElement.classList.toggle('dark',mode==='dark');
  localStorage.setItem('rn',JSON.stringify({auth:{user:auth.user,token:auth.token},bookmarks:bm,theme:mode}))},[auth,bm,mode]);
 return null}
export default function Providers({children}:{children:React.ReactNode}){const[qc]=useState(()=>new QueryClient());
 return<Provider store={store}><QueryClientProvider client={qc}><Sync/>{children}<Toasts/></QueryClientProvider></Provider>}
