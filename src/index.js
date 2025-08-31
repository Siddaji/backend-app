import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {app} from './app.js'

// ✅ Load .env file
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

// ✅ Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

connectDB()
.then(()=>{
  app.listen(PORT,()=>{
    console.log(`server is running at port:${PORT}`);
    
  })
})
.catch((err)=>{
  console.log("MONGO db connection failed!!!",err);
  

})

