import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const editUser = async (req, res) => {
    try {
        const id = req.id;

        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const { f_name, l_name } = req.body;
        if (!f_name || !l_name) {
            return res.status(400).json({ error: "First and last name are required" });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { f_name, l_name },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Database update error:", error);
        res.status(400).json({ error: error.message });
    }
};

