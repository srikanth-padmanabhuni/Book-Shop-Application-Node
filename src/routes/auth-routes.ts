import express from "express";
import { login } from "../controllers/auth-controller";

const router = express.Router();

router.post('/api/login', (req, res) => {
    return login(req, res);
});

export {router as authRoutes }