import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);



import {
    register,
    login,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";



router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;