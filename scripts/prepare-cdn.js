import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create chatbot directory
const chatbotDir = path.join(publicDir, "chatbot");
if (!fs.existsSync(chatbotDir)) {
  fs.mkdirSync(chatbotDir, { recursive: true });
}

// Copy built files from dist to public/chatbot
const distDir = path.join(__dirname, "../dist");
const files = fs.readdirSync(distDir);

files.forEach((file) => {
  const srcPath = path.join(distDir, file);
  const destPath = path.join(chatbotDir, file);

  if (fs.lstatSync(srcPath).isFile()) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to public/chatbot/`);
  }
});

console.log("✅ CDN files prepared successfully!");
