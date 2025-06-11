import prisma from "../../lib/db.js";
import cloudinary from "../../utils/cloudinary.js";

const updateCategory = async (req, res) => {
  const { name, description } = req.body;
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
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (existingCategory) {
      const updateCategory = await prisma.category.update({
        where: {
          id: categoryId,
        },

        data: {
          name,
          description,

          ...(imageUrl && { imageUrl: imageUrl }),
        },
      });
      res
        .status(200)
        .json({ message: "Updated SucessFully", category: updateCategory });
    } else {
      res.status(404).json({ error: "This category does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};
export default updateCategory;
