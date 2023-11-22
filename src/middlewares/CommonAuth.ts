import { NextFunction, Request, Response } from "express";
import { AuthPayLoad } from "../dto/Auth.dto";
import { validateSignature } from "../utility";

declare global {
    namespace Express{
        interface Request{
            user?:AuthPayLoad
        }
    }
}
export const Authenticate = async (req: Request, res: Response, next:NextFunction) =>{
    const signature = await validateSignature(req);
    if(signature){
    return   next()
    }
    return res.json({"message":"User not Authorized"})
}