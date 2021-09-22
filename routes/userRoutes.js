import express from "express";
import { loginUser, registerUser, verifyUserLogIn, verifyUserSignIn } from "../controller/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify/login",verifyUserLogIn);
router.post("/verify/signin",verifyUserSignIn);
export default router;