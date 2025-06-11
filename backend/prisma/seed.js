import prisma from "../lib/db.js";
import bcrypt from "bcrypt";

async function seed() {
  const adminEmail = process.env.adminEmail;
  const password = process.env.password;
  const name = process.env.name;

  const existingEmail = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingEmail) {
    throw new Error("Email already Exist in Db");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: name,
        role: "ADMIN",
      },
    });
    console.log("Admin Created");
  }
}
seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
