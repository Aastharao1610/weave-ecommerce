//path name /backend/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});
console.log("Cloudinary config:", {
  name: process.env.CLOUD_NAME,
  key: process.env.CLOUDINARY_APIKEY,
  secret: process.env.CLOUDINARY_APISECRET ? "loaded" : "missing",
});

export default cloudinary;
