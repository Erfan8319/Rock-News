export const fmt=(d:string)=>new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium'}).format(new Date(d));
