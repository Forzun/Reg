import jwt from "jsonwebtoken";
import { Request , Response, NextFunction } from "express";



export const userMiddleware = (req: Request  , res: Response , next: NextFunction) => { 
    try{ 
        const header = req.headers['authorization'];  
        console.log(header);

        const decoded = jwt.verify(header as string, "secrect") as { userId: string }; 

        if(decoded){ 
            req.userId = decoded.userId;
            next();
        }else{ 
            res.json({ 
                message:"you are not logined"
            })
        }
    }catch(error){ 

    }
}






