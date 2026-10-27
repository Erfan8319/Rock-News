'use client';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import {RootState} from '@/lib/store';
import NewsCard from '@/components/NewsCard';
export default function Bookmarks(){const items=useSelector((s:RootState)=>s.bookmarks.items);
 return<div className="space-y-5"><h1 className="text-2xl font-black">بوکمارک‌ها <span className="text-base font-normal text-stone-500">({items.length})</span></h1>
 {items.length?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(n=><NewsCard key={n.id} n={n}/>)}</div>
 :<div className="card p-10 text-center"><div className="text-4xl">🔖</div><p className="mt-2 font-bold">هنوز خبری ذخیره نکرده‌اید</p><p className="mb-4 text-sm text-stone-500">روی آیکون بوکمارک هر خبر بزنید تا اینجا بماند.</p><Link href="/" className="btn">دیدن اخبار</Link></div>}</div>}
