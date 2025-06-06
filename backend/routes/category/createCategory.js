import { PrismaClient } from "@prisma/client";
import express from "express";
import cloudinary from "../../utils/cloudinary.js";
import upload from "../../utils/multer.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, parentId } = req.body;
    if (!name || !description || !parentId) {
      throw new Error("All fields are required");
    }
    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((res, rej) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Category",
          },
          (err, result) => {
            if (err) return rej(err);
            res(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        parentId: parentId ? parseInt(parentId) : "null",
        imageUrl,
      },
    });
    res.status(201).json({
      message: "Category Created Successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ erorr: "Internal server Error" });
  }
});
export default router;
