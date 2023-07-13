import express from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/book-controller";

const router = express.Router();

router.post('/api/create', (req, res) => {
    return createBook(req, res);
})

router.put('/api/update', (req, res) => {
    return updateBook(req, res);
})

router.delete('/api/delete', (req, res) => {
    return deleteBook(req, res);
})

router.get('/api/getAll', (req, res) => {
    return getBooks(req, res);
})

router.post('/api/get', (req, res) => {
    return getBookById(req, res);
})

export { router as bookRoutes }