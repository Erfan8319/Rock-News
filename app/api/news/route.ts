import {NextRequest,NextResponse} from 'next/server';
import {query,db} from '@/lib/news';
import {isAdmin} from '@/lib/auth';
export const dynamic='force-dynamic';
export async function GET(r:NextRequest){const p=r.nextUrl.searchParams;
 try{return NextResponse.json(await query({q:p.get('q')||'',cat:p.get('cat')||'',src:p.get('src')||'',page:+(p.get('page')||1),limit:+(p.get('limit')||9),drafts:p.get('admin')==='1'&&isAdmin(r)}))}
 catch(e:any){console.error(e);return NextResponse.json({items:[],total:0,pages:1,page:1,offline:true,debug:['server: '+(e?.message||e)]})}}
export async function POST(r:NextRequest){if(!isAdmin(r))return NextResponse.json({error:'unauthorized'},{status:401});
 const b=await r.json().catch(()=>null);if(!b?.title)return NextResponse.json({error:'عنوان الزامی است'},{status:400});
 const n={...b,id:'a'+Date.now(),source:'Admin',url:'',date:new Date().toISOString()};db.created.unshift(n);return NextResponse.json(n)}
