import express from "express";
import { addAdmin, login } from "../controllers/auth-controller";

const router = express.Router();

router.post('/api/login', (req, res) => {
    return login(req, res);
});

router.post('/api/addAdmin', (req, res) => {
    return addAdmin(req, res);
})

export {router as authRoutes }