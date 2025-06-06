import { PrismaClient } from "@prisma/client";
import express from "express";
import cloudinary from "../../utils/cloudinary.js";
import upload from "../../utils/multer.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { name, description, baseprice, variant, categoryId } = req.body;
    let parsedVariants = [];
    if (variant) {
      try {
        parsedVariants = JSON.parse(variant);
      } catch (err) {
        return res.status(400).json({ error: "Invalid variant JSON format" });
      }
    }

    const uploadImages = await Promise.all(
      req.files.map((file) => {
        return new Promise((res, rej) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (error) rej(error);
              else res(result);
            }
          );
          stream.end(file.buffer);
        });
      })
    );
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        basePrice: parseFloat(baseprice),
        categoryId: parseInt(categoryId),
        variant: parsedVariants.length
          ? {
              create: parsedVariants.map((v) => ({
                color: v.color,
                size: v.size,
                price: parseFloat(v.price),
                stock: parseInt(v.stock),
              })),
            }
          : undefined,

        images: {
          create: uploadImages.map((img) => ({
            url: img.secure_url,
            altText: name,
          })),
        },
      },
      include: {
        variant: true,
      },
    });
    res
      .status(201)
      .json({ message: "Product Created Successfully", product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});
export default router;
