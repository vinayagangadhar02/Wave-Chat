import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMessages = async (req, res) => {
  try {
  
    const loggedInUserId = req.id; 
    const { senderId, recipientId } = req.query;

   
    if (loggedInUserId !== senderId && loggedInUserId !== recipientId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, recipientId: recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      },
      orderBy: {
        timestamp: "asc",
      },
      select: {
        id: true,
        senderId: true,
        recipientId: true,
        messageType: true,
        content: true,
        fileUrl: true,
        timestamp: true,
        status: true,
      },
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getMessages };
