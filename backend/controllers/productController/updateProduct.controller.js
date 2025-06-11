import prisma from "../../lib/db.js";

import cloudinary from "../../utils/cloudinary.js";

const updateProduct = async (req, res) => {
  const { name, description, baseprice, variant, subcategoryId } = req.body;
  const { id } = req.params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
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

    const updateProduct = await prisma.product.update({
      where: {
        id: productId,
      },
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
        images: uploadImages.length
          ? {
              create: uploadImages.map((img) => ({
                url: img.secure_url,
                altText: name,
              })),
            }
          : undefined,
      },
      include: {
        variant: true,
        images: true,
      },
    });
    res
      .status(200)
      .json({ message: "Updated Sucessfully", product: updateProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateProduct;
