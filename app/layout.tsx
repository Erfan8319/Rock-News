import './globals.css';
import {Vazirmatn} from 'next/font/google';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
const font=Vazirmatn({subsets:['arabic','latin'],variable:'--font',display:'swap'});
export const metadata={title:'RockWire | اخبار راک و متال',description:'آخرین اخبار موسیقی راک و متال از Loudwire و Loudersound'};
export default function Root({children}:{children:React.ReactNode}){
 return<html lang="fa" dir="rtl" className={`dark ${font.variable}`} suppressHydrationWarning>
 <head><script dangerouslySetInnerHTML={{__html:"try{if(JSON.parse(localStorage.getItem('rn')).theme==='light')document.documentElement.classList.remove('dark')}catch(e){}"}}/></head>
 <body><Providers><Header/><main className="mx-auto min-h-[75vh] max-w-6xl px-4 py-6">{children}</main>
 <footer className="mt-10 border-t border-stone-200 py-8 text-center text-sm text-stone-500 dark:border-neutral-800">اخبار از Loudwire و Loudersound · RockWire 🤘</footer></Providers></body></html>}
