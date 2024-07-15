import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import { getUsers } from "../controllers/user.controller.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get('/', verifyToken, getUsers);
router.get('/profile', verifyToken, getUserProfile);

export default router;