import prisma from "../../lib/db.js";

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return req.status(404).json({ error: "User not found" });
    }
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ messahe: "User Deleted Succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export default deleteUser;
