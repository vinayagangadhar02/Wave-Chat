import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

 const searchContacts = async (req, res, next) => {
  try {
    const { searchQuery } = req.query;

    let contacts;
    if (!searchQuery) {
      contacts = await prisma.user.findMany({
        where: { id: { not: req.id } },
        select: { id: true, f_name: true, l_name: true, email: true }
      });
    } else {
      contacts = await prisma.user.findMany({
        where: {
          id: { not: req.id },
          OR: [
            { f_name: { contains: searchQuery, mode: "insensitive" } },
            { l_name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, f_name: true, l_name: true, email: true }
      });
    }

    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};
export default searchContacts;