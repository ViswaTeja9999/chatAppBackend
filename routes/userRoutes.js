import express from "express";
import { loginUser,  verifyUserLogIn, updateProfile } from "../controller/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify/login",verifyUserLogIn);
router.post("/update/profile",updateProfile)
export default router;