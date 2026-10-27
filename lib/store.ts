import {configureStore,createSlice,PayloadAction} from '@reduxjs/toolkit';
import {News} from './types';
export interface User{email:string;name:string}
const auth=createSlice({name:'auth',initialState:{user:null as User|null,token:null as string|null,ready:false},reducers:{
 login(s,a:PayloadAction<{user:User;token:string}>){s.user=a.payload.user;s.token=a.payload.token},
 logout(s){s.user=null;s.token=null},
 hydrate(s,a:PayloadAction<{user:User|null;token:string|null}|undefined>){if(a.payload){s.user=a.payload.user;s.token=a.payload.token}s.ready=true}}});
const bookmarks=createSlice({name:'bookmarks',initialState:{items:[] as News[]},reducers:{
 toggle(s,a:PayloadAction<News>){const i=s.items.findIndex(x=>x.id===a.payload.id);i>=0?s.items.splice(i,1):s.items.push(a.payload)},
 hydrate(s,a:PayloadAction<News[]>){s.items=a.payload}}});
const theme=createSlice({name:'theme',initialState:{mode:'dark' as 'dark'|'light'},reducers:{
 toggleTheme(s){s.mode=s.mode==='dark'?'light':'dark'},hydrate(s,a:PayloadAction<'dark'|'light'>){s.mode=a.payload}}});
export const A=auth.actions,B=bookmarks.actions,T=theme.actions;
export const store=configureStore({reducer:{auth:auth.reducer,bookmarks:bookmarks.reducer,theme:theme.reducer}});
export type RootState=ReturnType<typeof store.getState>;
