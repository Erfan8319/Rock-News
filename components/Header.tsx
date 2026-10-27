'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useDispatch,useSelector} from 'react-redux';
import {A,T,RootState} from '@/lib/store';
export default function Header(){const d=useDispatch(),{auth,theme,bookmarks}=useSelector((s:RootState)=>s),p=usePathname(),n=bookmarks.items.length;
 const L=(h:string,t:React.ReactNode)=><Link href={h} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-stone-100 dark:hover:bg-neutral-800 ${p===h?'bg-stone-100 text-red-500 dark:bg-neutral-800':''}`}>{t}</Link>;
 return<header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80"><div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4">
  <Link href="/" className="me-2 flex items-center gap-2 text-lg font-black"><span className="grid h-8 w-8 place-items-center rounded-lg bg-red-600">🤘</span><span className="hidden sm:inline">Rock<span className="text-red-500">Wire</span></span></Link>
  {L('/','خانه')}{L('/bookmarks',<>بوکمارک‌ها{n>0&&<span className="ms-1 rounded-full bg-red-600 px-1.5 text-xs text-white">{n}</span>}</>)}{auth.user&&L('/admin','مدیریت')}
  <div className="ms-auto flex items-center gap-2"><button onClick={()=>d(T.toggleTheme())} aria-label="تغییر تم" className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100 dark:hover:bg-neutral-800">{theme.mode==='dark'?'☀️':'🌙'}</button>
  {auth.user?<button className="btn-ghost !py-1.5" onClick={()=>d(A.logout())}>خروج</button>:<Link href="/login" className="btn !py-1.5">ورود</Link>}</div>
 </div></header>}
