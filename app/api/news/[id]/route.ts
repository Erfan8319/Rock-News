import {NextRequest,NextResponse} from 'next/server';
import {db,getAll} from '@/lib/news';
import {isAdmin} from '@/lib/auth';
export const dynamic='force-dynamic';
const no=()=>NextResponse.json({error:'unauthorized'},{status:401});
export async function GET(_:NextRequest,{params}:{params:{id:string}}){const n=(await getAll(true)).find(x=>x.id===params.id);
 return n?NextResponse.json(n):NextResponse.json({error:'not found'},{status:404})}
export async function PUT(r:NextRequest,{params}:{params:{id:string}}){if(!isAdmin(r))return no();
 const b=await r.json(),i=db.created.findIndex((x:any)=>x.id===params.id);
 if(i>=0)db.created[i]={...db.created[i],...b};else db.over[params.id]={...db.over[params.id],...b};return NextResponse.json({ok:true})}
export async function DELETE(r:NextRequest,{params}:{params:{id:string}}){if(!isAdmin(r))return no();
 db.created=db.created.filter((x:any)=>x.id!==params.id);db.del.add(params.id);return NextResponse.json({ok:true})}
