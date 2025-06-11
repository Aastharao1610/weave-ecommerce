import { Prisma } from "@prisma/client";

export function handlePrismaError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          status: 409,
          message: `Duplicate parentId. Each category must have a unique parentId`,
        };
      case "P2003":
        return {
          status: 400,
          message: `Invalid foreign key reference: ${error.meta.field_name}`,
        };
      case "P2004":
        return {
          status: 404,
          message: `Record not found or alredy exsits`,
        };
      default:
        return {
          status: 500,
          message: `Unexpected Prisma error: ${error.message}`,
        };
    }
  }
  return {
    status: 500,
    message: "Unknown Server error",
  };
}
