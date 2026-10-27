import Parser from 'rss-parser';
import {createHash} from 'crypto';
import {News,Page} from './types';
import {SAMPLE} from './sample';
const FEEDS=[{name:'Loudersound',urls:['https://www.loudersound.com/feeds/all','https://www.loudersound.com/feeds.xml']},{name:'Loudwire',urls:['https://loudwire.com/feed/']}];
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const parser=new Parser({customFields:{item:[['media:content','media'],['media:thumbnail','thumb'],['content:encoded','full']]}});
const g=globalThis as any;
g.__db??={created:[],over:{},del:new Set(),cache:null,good:null,at:0,offline:false};
export const db=g.__db;
const strip=(h='')=>h.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
export function classify(t:string){const s=t.toLowerCase();
 if(/review|album/.test(s))return'بررسی آلبوم';if(/tour|festival|concert|live/.test(s))return'تور و فستیوال';
 if(/prog/.test(s))return'Prog';if(/classic|sabbath|zeppelin|deep purple|queen|ac\/dc|kiss|beatles/.test(s))return'Classic Rock';return'Metal'}
async function agent(){const p=process.env.HTTPS_PROXY||process.env.HTTP_PROXY||process.env.PROXY_URL;if(!p)return undefined;
 try{const{ProxyAgent}=await import('undici');return new ProxyAgent(p)}catch{return undefined}}
async function pull(f:typeof FEEDS[0]):Promise<{items:News[];err:string}>{
 const signal=AbortSignal.timeout(8000),dispatcher=await agent();let err='';
 for(const url of f.urls){try{
  const r=await fetch(url,{headers:{'User-Agent':UA,Accept:'application/rss+xml, application/xml, text/xml, */*'},cache:'no-store',signal,...(dispatcher?{dispatcher}:{})} as any);
  if(!r.ok){err=`${f.name}: HTTP ${r.status}`;continue}
  const feed=await parser.parseString(await r.text());
  const items=feed.items.map((i:any):News=>{const raw=i.full||i.content||'',full=strip(raw||i.contentSnippet||''),d=new Date(i.isoDate||i.pubDate||Date.now());
   return{id:createHash('md5').update(i.guid||i.link||i.title||'').digest('hex').slice(0,16),title:strip(i.title||''),description:strip(i.contentSnippet||i.summary||full).slice(0,220),content:full,
   image:i.media?.$?.url||i.thumb?.$?.url||i.enclosure?.url||(/<img[^>]+src=["']([^"']+)/.exec(raw)||[])[1]||'',
   category:classify((i.categories||[]).join(' ')+' '+i.title),source:f.name,url:i.link||'',date:(isNaN(+d)?new Date():d).toISOString(),status:'published'}});
  if(items.length)return{items,err:''};err=`${f.name}: empty feed`}
  catch(e:any){err=`${f.name}: ${e?.cause?.code||e?.name||''} ${e?.message||e}`}}
 return{items:[],err}}
async function rss():Promise<News[]>{
 if(db.cache&&Date.now()-db.at<(db.errs?.length?30000:300000))return db.cache;
 const res=await Promise.all(FEEDS.map(pull)),r=res.flatMap(x=>x.items);db.errs=res.map(x=>x.err).filter(Boolean);
 if(r.length)db.good=r;
 db.cache=r.length?r:(db.good||SAMPLE);db.offline=!r.length&&!db.good;db.at=Date.now();return db.cache}
export async function getAll(drafts=false){
 const seen=new Set<string>();
 const all=[...db.created,...(await rss())].filter((n:News)=>!db.del.has(n.id)&&!seen.has(n.id)&&seen.add(n.id)).map((n:News)=>({...n,...db.over[n.id]}) as News);
 return(drafts?all:all.filter(n=>n.status==='published')).sort((a,b)=>+new Date(b.date)-+new Date(a.date))}
export async function query(o:{q?:string;cat?:string;src?:string;page?:number;limit?:number;drafts?:boolean}):Promise<Page>{
 const q=(o.q||'').toLowerCase(),limit=o.limit||9;
 const f=(await getAll(o.drafts)).filter(n=>(!q||(n.title+n.description).toLowerCase().includes(q))&&(!o.cat||n.category===o.cat)&&(!o.src||n.source===o.src));
 const pages=Math.max(1,Math.ceil(f.length/limit)),page=Math.min(Math.max(1,o.page||1),pages);
 return{items:f.slice((page-1)*limit,page*limit),total:f.length,pages,page,offline:db.offline,debug:db.errs||[]}}
