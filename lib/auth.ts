export const isAdmin=(r:Request)=>/^Bearer .+/.test(r.headers.get('authorization')||'');
