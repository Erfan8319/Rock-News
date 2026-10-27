'use client';
import {Fragment,Suspense,useEffect,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {useNewsList} from '@/hooks/useNews';
import NewsCard,{SkeletonCard} from '@/components/NewsCard';
import {CATEGORIES} from '@/lib/types';
const SRC=[['','همه منابع'],['Loudwire','Loudwire'],['Loudersound','Loudersound']];
function Home(){const sp=useSearchParams(),router=useRouter();
 const q=sp.get('q')??'',cat=sp.get('cat')??'',src=sp.get('src')??'',page=+(sp.get('page')??1)||1;
 const[text,setText]=useState(q);
 const set=(o:Record<string,string>)=>{const p=new URLSearchParams(sp.toString());Object.entries(o).forEach(([k,v])=>v&&!(k==='page'&&v==='1')?p.set(k,v):p.delete(k));
  router.replace('/?'+p.toString(),{scroll:false});if('page' in o)window.scrollTo({top:0,behavior:'smooth'})};
 useEffect(()=>{const t=setTimeout(()=>text!==q&&set({q:text,page:'1'}),400);return()=>clearTimeout(t)},[text]);
 useEffect(()=>setText(q),[q]);
 const{data,isLoading,isError,error,isFetching,refetch}=useNewsList({q,cat,src,page:String(page)});
 const filtered=!!(q||cat||src),feature=!filtered&&page===1;
 const nums=data?Array.from({length:data.pages},(_,i)=>i+1).filter(p=>p===1||p===data.pages||Math.abs(p-data.page)<=1):[];
 return<div className="space-y-6">
  <section className="rounded-3xl bg-gradient-to-br from-red-700 via-red-900 to-neutral-950 p-6 text-white sm:p-10">
   <h1 className="text-2xl font-black sm:text-4xl">آخرین اخبار دنیای راک و متال 🤘</h1>
   <p className="mt-2 text-sm text-red-100 sm:text-base">تجمیع زنده‌ی خبرهای Loudwire و Loudersound در یک‌جا</p>
   <div className="relative mt-6"><input type="search" value={text} onChange={e=>setText(e.target.value)} placeholder="جستجو: Metallica، Iron Maiden، tour…" aria-label="جستجوی اخبار"
    className="w-full rounded-2xl bg-white/95 px-5 py-4 pe-12 text-base text-stone-900 shadow-lg placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-red-400/50"/><span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span></div></section>
  <div className="space-y-3">
   <div className="noscroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"><button className={`chip ${!cat?'chip-on':''}`} onClick={()=>set({cat:'',page:'1'})}>همه</button>{CATEGORIES.map(c=><button key={c} className={`chip ${cat===c?'chip-on':''}`} onClick={()=>set({cat:c,page:'1'})}>{c}</button>)}</div>
   <div className="flex flex-wrap items-center justify-between gap-3"><div className="inline-flex rounded-xl bg-stone-200 p-1 dark:bg-neutral-800">{SRC.map(([v,l])=><button key={v} onClick={()=>set({src:v,page:'1'})} className={`rounded-lg px-3 py-1 text-sm transition ${src===v?'bg-white font-bold shadow dark:bg-neutral-700':'text-stone-600 dark:text-neutral-400'}`}>{l}</button>)}</div>
    <div className="flex items-center gap-3 text-sm text-stone-500">{data&&<span>{data.total} خبر</span>}{filtered&&<button className="font-semibold text-red-500 hover:underline" onClick={()=>{setText('');router.replace('/',{scroll:false})}}>پاک کردن فیلترها ✕</button>}</div></div></div>
  {data&&(data.offline||!!data.debug?.length)&&<div role="status" className="rounded-xl border border-amber-400/50 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"><p>{data.offline?'سرور نتوانست فیدها را بگیرد و اخبار نمونه نمایش داده می‌شود.':'بعضی منابع در دسترس نیستند.'} فیلترشکن مرورگر روی سرور Next اثر ندارد (راهنمای README).<button onClick={()=>refetch()} className="mx-2 font-bold underline">تلاش دوباره</button></p>{data.debug?.map(x=><p key={x} dir="ltr" className="mt-1 text-xs opacity-80">{x}</p>)}</div>}
  {isError&&<div role="alert" className="card p-8 text-center"><div className="text-4xl">😵</div><p className="mt-2 font-bold">دریافت اخبار با مشکل روبه‌رو شد</p><p dir="ltr" className="mt-1 text-xs text-stone-500">{String((error as Error)?.message||'')}</p><button className="btn mt-4" onClick={()=>refetch()}>تلاش دوباره</button></div>}
  <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${isFetching&&!isLoading?'opacity-60 transition':''}`}>{isLoading?Array.from({length:6},(_,i)=><SkeletonCard key={i}/>):data?.items.map((n,i)=><NewsCard key={n.id} n={n} big={feature&&i===0}/>)}</div>
  {data&&!data.items.length&&<div className="card p-10 text-center"><div className="text-4xl">🎸</div><p className="mt-2 font-bold">خبری با این مشخصات پیدا نشد</p><p className="text-sm text-stone-500">عبارت دیگری را جستجو کنید یا فیلترها را پاک کنید.</p></div>}
  {data&&data.pages>1&&<nav aria-label="صفحه‌بندی" className="flex flex-wrap items-center justify-center gap-2"><button className="btn-ghost" disabled={data.page<=1} onClick={()=>set({page:String(data.page-1)})}>قبلی</button>
   {nums.map((p,i)=><Fragment key={p}>{i>0&&p-nums[i-1]>1&&<span className="text-stone-400">…</span>}<button onClick={()=>set({page:String(p)})} aria-current={p===data.page} className={`chip !px-3.5 ${p===data.page?'chip-on':''}`}>{p}</button></Fragment>)}
   <button className="btn-ghost" disabled={data.page>=data.pages} onClick={()=>set({page:String(data.page+1)})}>بعدی</button></nav>}</div>}
export default function Page(){return<Suspense><Home/></Suspense>}
