'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';
import {A} from '@/lib/store';
import {login} from '@/services/newsService';
import {toast} from '@/components/Providers';
export default function Login(){const[f,setF]=useState({email:'',password:''}),[err,setErr]=useState<Record<string,string>>({}),[busy,setBusy]=useState(false),d=useDispatch(),r=useRouter();
 const submit=async(e:React.FormEvent)=>{e.preventDefault();const x:Record<string,string>={};
  if(!f.email)x.email='ایمیل الزامی است';else if(!/^\S+@\S+\.\S+$/.test(f.email))x.email='فرمت ایمیل درست نیست';
  if(!f.password)x.password='رمز عبور الزامی است';setErr(x);if(Object.keys(x).length)return;
  setBusy(true);try{d(A.login(await login(f)));toast('خوش آمدید 🤘');r.push('/admin')}catch(e:any){toast(e.message,'error')}setBusy(false)};
 const fld=(k:'email'|'password',l:string,t:string)=><div><label className="label" htmlFor={k}>{l}</label><input id={k} type={t} dir="ltr" autoComplete={k==='email'?'email':'current-password'} className="inp" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/>{err[k]&&<p role="alert" className="mt-1 text-xs text-red-500">{err[k]}</p>}</div>;
 return<form onSubmit={submit} noValidate className="card mx-auto mt-6 max-w-md space-y-4 p-6 sm:p-8"><div className="text-center"><div className="text-4xl">🤘</div><h1 className="mt-2 text-2xl font-black">ورود به پنل مدیریت</h1>
  <p className="mt-1 text-sm text-stone-500">نسخه نمایشی: هر ایمیل معتبر و رمزی با حداقل ۴ حرف کافی است.</p></div>
  {fld('email','ایمیل','email')}{fld('password','رمز عبور','password')}<button className="btn w-full !py-3" disabled={busy}>{busy?'در حال ورود…':'ورود'}</button></form>}
