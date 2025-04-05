import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDetails = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, f_name: true, l_name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getDetails };
