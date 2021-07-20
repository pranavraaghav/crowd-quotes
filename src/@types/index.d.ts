declare module Express {
  export interface Request {
   decoded: {
       userId: string; 
   }
  }
}