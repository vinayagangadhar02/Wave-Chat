import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from '../validators/uservalidator.js';
import dotenv from "dotenv";

dotenv.config(); 

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const { f_name, l_name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { f_name, l_name, email, password: hashedPassword }
    });

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );

    return res.status(201).json({ message: "User registered", token });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(400).json({ error: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );

    return res.status(200).json({ message: "Login successful", token });
};
