import express from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/book-controller";
import { validateToken, validateTokenForAuthor } from "../controllers/auth-controller";

const router = express.Router();

router.post('/api/create', validateTokenForAuthor, (req, res) => {
    return createBook(req, res);
})

router.put('/api/update', validateTokenForAuthor, (req, res) => {
    return updateBook(req, res);
})

router.delete('/api/delete', validateTokenForAuthor, (req, res) => {
    return deleteBook(req, res);
})

router.get('/api/getAll', validateToken, (req, res) => {
    return getBooks(req, res);
})

router.post('/api/get', validateToken, (req, res) => {
    return getBookById(req, res);
})

export { router as bookRoutes }