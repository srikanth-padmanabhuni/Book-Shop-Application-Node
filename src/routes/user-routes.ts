import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user-controller";

const router = express.Router();

router.post('/api/create', (req, res) => {
    return createUser(req, res);
})

router.put('/api/update', (req, res) => {
    return updateUser(req, res);
})

router.delete('/api/delete', (req, res) => {
    return deleteUser(req, res);
})

router.get('/api/getAll', (req, res) => {
    return getAllUsers(req, res);
})

router.post('/api/get', (req, res) => {
    return getUserById(req, res);
})

export { router as userRoutes }