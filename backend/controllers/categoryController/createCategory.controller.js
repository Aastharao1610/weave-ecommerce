import prisma from "../../lib/db.js";
import cloudinary from "../../utils/cloudinary.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required." });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Category" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
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
        imageUrl,
      },
    });

    res.status(201).json({
      message: "Category Created Successfully",
      category: newCategory,
    });
  } catch (error) {
    const handled = handlePrismaError(error);
    if (handled) {
      return res.status(handled.status).json({ message: handled.message });
    }

    console.error("Unhandled Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export default createCategory;
