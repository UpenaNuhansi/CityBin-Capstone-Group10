import { Router } from "express";

const userRouter = Router();






userRouter.post('/',async(c,w)=>{
    const data = c.body;
    try{
            const newUser = await User.create(data);
            return w.status(201).send(newUser);
    }catch(error){
        console.log(error);
        return w.status(500).send('internal server error');
        
    }
    
})



export default userRouter;