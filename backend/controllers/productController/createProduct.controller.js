import prisma from "../../lib/db.js";

import cloudinary from "../../utils/cloudinary.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, baseprice, variant, subcategoryId } = req.body;
    console.log("BODY:", req.body);

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
    console.log("FILES:", req.files || req.file);
    const subCategory = await prisma.subcategory.findUnique({
      where: {
        id: parseInt(subcategoryId),
      },
    });
    if (subCategory) {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          basePrice: parseFloat(baseprice),
          subcategoryId: parseInt(subcategoryId),
          variant: parsedVariants.length
            ? {
                create: parsedVariants.map((v) => ({
                  color: v.color,
                  size: v.size,
                  price: parseFloat(v.price),
                  stock: parseInt(v.stock),
                  sku: v.sku,
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
      if (newProduct) {
        res.status(201).json({
          message: "Product Created Successfully",
          product: newProduct,
        });
      } else {
        res
          .status(404)
          .json({ message: "there is some issue in creating a product" });
      }
    } else {
      res.status(400).json({ message: "subcateogry does not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};
export default createProduct;
