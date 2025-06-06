import { PrismaClient } from "@prisma/client";
import express from "express";
import upload from "../../utils/multer.js";
import cloudinary from "../../utils/cloudinary.js";

const prisma = new PrismaClient();
const router = express.Router();

router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { name, description, parentId } = req.body;
  const { id } = req.params;

  const categoryId = parseInt(id);
  if (isNaN(categoryId)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }
  try {
    let imageUrl;
    if (req.file) {
      const uploadImages = await new Promise((res, rej) => {
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
      imageUrl = uploadImages.secure_url;
    }
    const updateCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },

      data: {
        name,
        description,
        parent: parentId ? { connect: { id: parseInt(parentId) } } : undefined,
        ...(imageUrl && { imageUrl: imageUrl }),
      },
    });
    res
      .status(200)
      .json({ message: "Updated SucessFully", category: updateCategory });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});
export default router;
