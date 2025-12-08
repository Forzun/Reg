import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { userMiddleware } from './middleware/auth';
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from './utils/auth';
import { summarizeText } from './llm/header';

const app = express();

app.all("/api/auth/*", toNodeHandler(auth));


app.use(
    cors({
      origin: "http://localhost:3000", // Replace with your frontend's origin
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );
  

app.use(express.json());


app.get("/api/me", async (req: Request , res: Response) => { 
    const session = await auth.api.getSession({ 
        headers: fromNodeHeaders(req.headers),  
    })

    if(!session) { 
        return res.status(401).json({ 
            error: "Unauthorized"
        });
    }

    console.log(session);
    
    return res.json({ 
        user:session.user
    })
})

const JWT_SECRET = 'secrect';

interface UserProps { 
    username: string, 
    password: string | number
    token?: string;
}

const user:UserProps[] = [];

app.post("/signup" , (req: Request , res: Response) => { 
    const {username  , password} = req.body;

    const existingUser = user.find(user => user.username == username); 
    if(existingUser){ 
        return res.status(200).json({ 
            sucess: true, 
            message:"user name elready exit", 
            data: existingUser
        })
    }

    user.push({ 
        username, 
        password
    })

    res.status(200).json({ 
        sucess: true, 
        message:"signup sucessfully", 
        result: { 
            username, 
            password
        }
    })

})


app.get("/name/:username", (req: Request , res:Response) => { 
    const username = req.params.username; 

    const findUser = user.find(user => user.username == username); 
    
    if(findUser){ 
        res.send({ 
            findUser,
        })
    }

})

app.post("/signin", (req: Request , res:Response) => { 
    const {username , password } = req.body; 

    const findUser = user.find(user => user.username == username);
    
    if(findUser){
        const token = jwt.sign({
            username: findUser.username
        }, JWT_SECRET);

        console.log(token);
        findUser.token = token;
        
        res.status(200).json({ 
            sucess: true, 
            message:"sucessfull",
            data: findUser
        })

    } else {
        res.status(401).json({
            message: "Invalid credentials"
        })
    }
})

app.get("/me" , (req:Request , res: Response) => { 
    const authHeader = req.headers.authorization; 
    
    const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;
    
    if (!token) {
        return res.status(401).json({ 
            message: "No token provided"
        });
    }
    
    const findUser = user.find(user => user.token === token);
    console.log("token: " , token , findUser)

    if(findUser){ 
        return res.json({ 
            findUser
        })
    } else { 
        return res.status(401).json({ 
            message: "Unauthorized"
        })
    }
})

app.get("/api/health" , (_req , res) => { 
    res.json({
        ok: true,
    })
})

app.get("/allUser" , userMiddleware , (req: Request , res:Response) => { 
    const AllUser = user.find(user => user.username === req.userId); 
})

app.post('/api/llm/summarize', async (req: Request , res: Response) => { 
    try{ 
        const { text } = req.body;
        if (!text) {
          return res.status(400).json({ error: "text is required" });
        }

            const summary = await summarizeText(text);
            res.json({ summary })

    }catch(error){ 
        console.log(error);
        res.status(400).json({
            result: false, 
            error: error
        })
    }
})

app.listen(3005);