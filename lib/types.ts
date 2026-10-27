export const CATEGORIES=['Metal','Classic Rock','Prog','تور و فستیوال','بررسی آلبوم'];
export interface News{id:string;title:string;description:string;content:string;image:string;category:string;source:string;url:string;date:string;status:'published'|'draft'}
export interface Page{items:News[];total:number;pages:number;page:number;offline?:boolean;debug?:string[]}
