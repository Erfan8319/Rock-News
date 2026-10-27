'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';
import {RootState} from '@/lib/store';
import {useAdminList,useAdminMutations} from '@/hooks/useNews';
import {CATEGORIES,News} from '@/lib/types';
import {fmt} from '@/lib/format';
const empty={title:'',description:'',content:'',category:CATEGORIES[0],image:'',status:'published'};
const F=({l,children}:{l:string;children:React.ReactNode})=><label className="block"><span className="label">{l}</span>{children}</label>;
export default function Admin(){const{user,ready}=useSelector((s:RootState)=>s.auth),r=useRouter();
 useEffect(()=>{if(ready&&!user)r.replace('/login')},[ready,user,r]);
 const{data,isLoading}=useAdminList(),m=useAdminMutations();const[form,setForm]=useState<any>(null);
 if(!user)return null;
 const save=(e:React.FormEvent)=>{e.preventDefault();const{id,...b}=form;const o={onSuccess:()=>setForm(null)};id?m.update.mutate({id,...b},o):m.create.mutate(b,o)};
 const set=(k:string)=>(e:any)=>setForm({...form,[k]:e.target.value});
 return<div className="space-y-5"><div className="flex items-center justify-between"><h1 className="text-2xl font-black">مدیریت اخبار {data&&<span className="text-base font-normal text-stone-500">({data.total})</span>}</h1><button className="btn" onClick={()=>setForm(empty)}>+ خبر جدید</button></div>
  <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead className="bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-300"><tr>{['عنوان','دسته‌بندی','تاریخ','وضعیت','عملیات'].map(h=><th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
   <tbody>{isLoading?<tr><td colSpan={5} className="animate-pulse p-8 text-center">در حال بارگذاری…</td></tr>:data?.items.map((n:News)=><tr key={n.id} className="border-t border-stone-200 hover:bg-stone-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
    <td className="max-w-xs truncate p-3" dir="auto">{n.title}</td><td className="p-3">{n.category}</td><td className="p-3" suppressHydrationWarning>{fmt(n.date)}</td>
    <td className="p-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${n.status==='published'?'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300':'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}`}>{n.status==='published'?'منتشر شده':'پیش‌نویس'}</span></td>
    <td className="space-x-3 space-x-reverse p-3 text-nowrap"><button className="font-semibold text-blue-500 hover:underline" onClick={()=>setForm(n)}>ویرایش</button><button className="font-semibold text-red-500 hover:underline" onClick={()=>confirm('این خبر حذف شود؟')&&m.remove.mutate(n.id)}>حذف</button></td></tr>)}</tbody></table></div>
  {form&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={()=>setForm(null)}><form onSubmit={save} onClick={e=>e.stopPropagation()} className="card max-h-[90vh] w-full max-w-lg space-y-4 overflow-auto p-6">
   <h2 className="text-lg font-black">{form.id?'ویرایش خبر':'خبر جدید'}</h2>
   <F l="عنوان"><input required className="inp" value={form.title} onChange={set('title')}/></F>
   <F l="توضیح کوتاه"><textarea required className="inp" rows={2} value={form.description} onChange={set('description')}/></F>
   <F l="متن کامل"><textarea required className="inp" rows={6} value={form.content} onChange={set('content')}/></F>
   <div className="grid gap-4 sm:grid-cols-2"><F l="دسته‌بندی"><select className="inp" value={form.category} onChange={set('category')}>{[...new Set([form.category,...CATEGORIES])].map(c=><option key={c}>{c}</option>)}</select></F>
   <F l="وضعیت"><select className="inp" value={form.status} onChange={set('status')}><option value="published">منتشر شده</option><option value="draft">پیش‌نویس</option></select></F></div>
   <F l="آدرس تصویر"><input className="inp" dir="ltr" placeholder="https://…" value={form.image} onChange={set('image')}/></F>
   <div className="flex gap-2"><button className="btn">ذخیره</button><button type="button" className="btn-ghost" onClick={()=>setForm(null)}>انصراف</button></div></form></div>}</div>}
