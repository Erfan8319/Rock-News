import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getAll} from '@/lib/news';
import {fmt} from '@/lib/format';
import NewsCard,{BookmarkButton,Thumb} from '@/components/NewsCard';
export const dynamic='force-dynamic';
const find=async(id:string)=>{const all=await getAll();return{n:all.find(x=>x.id===id),all}};
const paras=(t:string)=>{const s=t.split(/(?<=[.!?])\s+/),o:string[]=[];for(let i=0;i<s.length;i+=3)o.push(s.slice(i,i+3).join(' '));return o};
export async function generateMetadata({params}:{params:{id:string}}){const{n}=await find(params.id);
 return n?{title:n.title,description:n.description,openGraph:{images:n.image?[n.image]:[]}}:{title:'خبر پیدا نشد'}}
export default async function Detail({params}:{params:{id:string}}){const{n,all}=await find(params.id);if(!n)notFound();
 const rel=all.filter(x=>x.category===n.category&&x.id!==n.id).slice(0,3);
 return<div className="mx-auto max-w-3xl space-y-6"><Link href="/" className="btn-ghost">→ بازگشت به اخبار</Link>
  <Thumb src={n.image} className="aspect-video w-full rounded-2xl object-cover"/>
  <div className="flex flex-wrap items-center gap-3 text-sm"><span className="rounded-full bg-red-600 px-3 py-1 font-bold text-white">{n.category}</span><span className="text-stone-500">{n.source} · {fmt(n.date)}</span><span className="ms-auto"><BookmarkButton n={n}/></span></div>
  <h1 dir="auto" className="text-3xl font-black leading-tight sm:text-4xl">{n.title}</h1>
  <div dir="auto" className="space-y-5 text-lg leading-9 text-stone-700 dark:text-neutral-300">{paras(n.content||n.description).map((p,i)=><p key={i}>{p}</p>)}</div>
  {n.url&&<a href={n.url} target="_blank" rel="noopener noreferrer" className="btn !px-6 !py-3">ادامه مطالعه در {n.source} ↗</a>}
  {!!rel.length&&<section className="border-t border-stone-200 pt-8 dark:border-neutral-800"><h2 className="mb-4 text-xl font-black">اخبار مرتبط</h2><div className="grid gap-5 sm:grid-cols-3">{rel.map(r=><NewsCard key={r.id} n={r}/>)}</div></section>}</div>}
