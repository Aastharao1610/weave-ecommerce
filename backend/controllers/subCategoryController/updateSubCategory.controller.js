import prisma from "../../lib/db.js";
import cloudinary from "../../utils/cloudinary.js";

const updateSubCategory = async (req, res) => {
  const { name } = req.body;
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
    const updateSubCategory = await prisma.subcategory.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        ...(imageUrl && { imageUrl: imageUrl }),
      },
    });
    res.status(200).json({
      message: "SubCateogry Updated Succssfully",
      subcategory: updateSubCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default updateSubCategory;
