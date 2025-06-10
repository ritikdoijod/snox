import { v2 as cloudinary } from "cloudinary";
import { config } from "@/configs/app";

export async function uploadFile(fileData) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  });

  const result = await cloudinary.uploader.upload(fileData);

  return result.secure_url;
}
