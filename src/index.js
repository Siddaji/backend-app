import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load .env file
dotenv.config({ path: "./.env" });

// ✅ Debug check
console.log("DEBUG PORT:", process.env.PORT);
console.log("DEBUG URI:", process.env.MONGODB_URI);

const app = express();
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

connectDB();

// ✅ Simple route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});