import fs from "node:fs/promises";
import path from "node:path";
import { customAlphabet } from 'nanoid'

export async function uploadFile(fileData) {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 15);
  // Extract mime type and base64 data from data URL
  const matches = fileData.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ error: "Invalid data URL format" });
  }
  const mimeType = matches[1]; // e.g., "image/jpeg"
  const base64Data = matches[2]; // Base64 data without prefix

  // Decode base64 data to buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Validate mime type
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(mimeType)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  // Generate a unique filename
  const uploadDir = "uploads/";
  await fs.mkdir(uploadDir, { recursive: true });
  const fileExtension = mimeType.split("/")[1]; // e.g., "jpeg"
  const fileName = `${nanoid()}.${fileExtension}`;
  const filePath = path.join(uploadDir, fileName);

  // Save the file
  await fs.writeFile(filePath, buffer);

  return fileName;
}

export async function deleteFile(filePath) {
  if (await fs.exists(filePath)) await fs.deleteFile(filePath);
}
