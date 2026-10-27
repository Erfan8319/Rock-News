'use client';
import Link from 'next/link';
import {useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {B,RootState} from '@/lib/store';
import {News} from '@/lib/types';
import {fmt} from '@/lib/format';
import {toast} from './Providers';
export function Thumb({src,className}:{src?:string;className:string}){const[bad,setBad]=useState(false);
 return src&&!bad?<img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={()=>setBad(true)} className={className}/>:<div className={`${className} grid place-items-center bg-gradient-to-br from-red-900 via-neutral-900 to-black text-5xl`}>🤘</div>}
export function BookmarkButton({n}:{n:News}){const d=useDispatch(),on=useSelector((s:RootState)=>s.bookmarks.items.some(i=>i.id===n.id));
 return<button onClick={()=>{d(B.toggle(n));toast(on?'از بوکمارک‌ها حذف شد':'به بوکمارک‌ها اضافه شد')}} aria-label={on?'حذف بوکمارک':'ذخیره خبر'} className={`grid h-9 w-9 place-items-center rounded-full transition hover:bg-stone-100 dark:hover:bg-neutral-800 ${on?'text-red-500':'text-stone-500'}`}>
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg></button>}
export function SkeletonCard(){return<div className="card animate-pulse overflow-hidden"><div className="aspect-video bg-stone-200 dark:bg-neutral-800"/><div className="space-y-3 p-4"><div className="h-4 w-4/5 rounded bg-stone-200 dark:bg-neutral-800"/><div className="h-3 rounded bg-stone-200 dark:bg-neutral-800"/><div className="h-3 w-1/2 rounded bg-stone-200 dark:bg-neutral-800"/></div></div>}
export default function NewsCard({n,big}:{n:News;big?:boolean}){
 return<article className={`card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg ${big?'lg:col-span-2':''}`}>
  <Link href={`/news/${n.id}`} className="relative block overflow-hidden"><Thumb src={n.image} className={`w-full object-cover transition duration-300 group-hover:scale-105 ${big?'aspect-[16/8]':'aspect-video'}`}/>
   <span className="absolute start-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">{n.category}</span></Link>
  <div className="flex flex-1 flex-col gap-2 p-4" dir="auto">
   <Link href={`/news/${n.id}`} className={`line-clamp-3 font-bold leading-snug transition group-hover:text-red-500 ${big?'text-2xl':'text-base'}`}>{n.title}</Link>
   <p className={`text-sm leading-6 text-stone-600 dark:text-neutral-400 ${big?'line-clamp-3':'line-clamp-2'}`}>{n.description}</p>
   <div className="mt-auto flex items-center justify-between pt-2 text-xs text-stone-500" dir="rtl"><span suppressHydrationWarning>{n.source} · {fmt(n.date)}</span><BookmarkButton n={n}/></div></div></article>}
