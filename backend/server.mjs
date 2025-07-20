import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; 
import rootRouter from "./src/routes/index.mjs";

const server = express();
const PORT = process.env.PORT || 4000;
 
server.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' http://localhost:5173; connect-src http://localhost:5001 http://localhost:5173; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  next();
});

server.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));


server.use(express.json());


server.use('/api', rootRouter);


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected..");
    server.listen(PORT, () => {
      console.log(`server running... on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1); 
  });
