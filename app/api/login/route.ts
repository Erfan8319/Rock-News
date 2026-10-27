import {NextResponse} from 'next/server';
export async function POST(r:Request){const{email,password}=await r.json().catch(()=>({}));
 if(!/^\S+@\S+\.\S+$/.test(email||'')||(password||'').length<4)return NextResponse.json({error:'ایمیل یا رمز عبور نامعتبر است'},{status:401});
 return NextResponse.json({user:{email,name:email.split('@')[0]},token:'mock-token'})}
