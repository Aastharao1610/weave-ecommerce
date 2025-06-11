import prisma from "../../lib/db.js";
import cloudinary from "../../utils/cloudinary.js";

const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((res, rej) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "subCategory",
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
    const newSubCategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
        imageUrl,
      },
    });
    res.status(201).json({
      message: "Subcategory Created Successfully",
      subcategory: newSubCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};
export default createSubCategory;
