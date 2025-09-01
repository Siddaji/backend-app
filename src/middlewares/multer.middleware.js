import multer from "multer";
import path from "path";
import fs from "fs";

// Define temp folder
const tempDir = path.join(process.cwd(), "public", "temp");

// Ensure temp folder exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`Created folder:, ${tempDir}`);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Export upload middleware
export const upload = multer({ storage });