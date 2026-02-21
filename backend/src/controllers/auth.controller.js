import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateJWT = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role }
        });

        res.json({
            message: "User registered",
            token: generateJWT(user),
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            token: generateJWT(user),
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.json({ message: "If email exists, reset link sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        console.log("Reset Token (Demo):", resetToken);

        res.json({ message: "If email exists, reset link sent." });
    } catch (err) {
        res.status(500).json({ message: "Forgot password failed" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { gte: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Reset failed" });
    }
};