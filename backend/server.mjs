import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import rootRouter from "./src/routes/index.mjs";

const server = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
server.use(express.json());


//route connect
server.use('api/v1',rootRouter)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected..");
    server.listen(PORT, () => {
      console.log(`server running... on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1); // Exit process on DB failure
  });
