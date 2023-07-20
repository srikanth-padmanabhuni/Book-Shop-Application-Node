import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user-controller";
import { validateToken, validateTokenForAdmin } from "../controllers/auth-controller";

const router = express.Router();

router.post('/api/create', validateTokenForAdmin, (req, res) => {
    return createUser(req, res);
})

router.put('/api/update', validateToken, (req, res) => {
    return updateUser(req, res);
})

router.delete('/api/delete', validateToken, (req, res) => {
    return deleteUser(req, res);
})

router.post('/api/getAll', validateTokenForAdmin, (req, res) => {
    return getAllUsers(req, res);
})

router.post('/api/get', validateToken, (req, res) => {
    return getUserById(req, res);
})

export { router as userRoutes }