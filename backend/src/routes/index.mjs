import { Router } from "express";
import userRouter from "./user.mjs";
import binRouter from "./bin.mjs"; 

const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/bin", binRouter); 

export default rootRouter;
