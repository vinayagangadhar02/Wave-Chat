import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export  const searchContacts = async (req, res, next) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(200).send("Search through name or email");
    }

    const contacts = await prisma.user.findMany({
      where: {
        id: { not: req.userId }, 
        OR: [
          { f_name: { contains: searchQuery, mode: "insensitive" } },
          { l_name: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
    });

    return res.status(200).json(contacts);
    
  } catch (error) {
    next(error);
  }
};
