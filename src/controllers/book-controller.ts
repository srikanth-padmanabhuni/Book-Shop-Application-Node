import { IBook, IError, ISuccess, UserRole } from "../constants/interfaces";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { getCustomErrorObj, getCustomSuccessObj, getErrorObj, mapBookEntityToDto } from "../mappers/mapper";
import { getBook, getUser } from "../utilities/helpers";
import { UpdateResult } from "typeorm";

export function createBook(req: any, res: any) {
    const book = {
        bookName: req.body?.bookName,
        authorId: req.body?.authorId,
        availableStock: req.body?.availableStock,
        bookType: req.body?.bookType
    }

    getUser(book.authorId)
        .then((user: User | null) => {
            if(!user || (user.role != UserRole.AUTHOR.toString())) {
                const err:IError = getCustomErrorObj(
                    "INVALID AUTHOR",
                    "Author Id is not Available or not a role of Author",
                    500
                )
                return res.json(err);
            }
        })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

    const bookEntity = Book.create({
        bookName: book.bookName,
        availableStock: book.availableStock,
        bookType: book.bookType,
        author_id: book.authorId
    });

    bookEntity
        .save()
        .then((savedBook: Book) => {
            const bookDto: IBook = mapBookEntityToDto(savedBook);
            return res.json(bookDto);
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })

}

export function deleteBook(req: any, res: any) {
    const bookId = req.body?.bookId;
    getBook(bookId)
        .then((book: Book | null) => {
            if(!book) {
                const errorDto: IError = getCustomErrorObj(
                    "INVALID BOOK",
                    "Book with givenId is not available!!!",
                    500
                );
                return res.json(errorDto);
            } else {
                book.remove().then((book: Book) => {
                    const successDto: ISuccess = getCustomSuccessObj(
                        "DELETE SUCCESSFUL",
                        "Book with given Id deleted successfully!!!",
                        200
                    );
                    return res.json(successDto);
                })
                .catch((error: Error) => {
                    console.log(error);
                    const errorDto: IError = getErrorObj(error);
                    return res.json(errorDto);
                })
            }
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })
}


export function getBookById(req: any, res: any) {
    const bookId = req.body?.bookId;
    getBook(bookId)
        .then((book: Book | null) => {
            if(!book) {
                const errorDto: IError = getCustomErrorObj(
                    "INVALID BOOK",
                    "Book with givenId is not available!!!",
                    500
                );
                return res.json(errorDto);
            } else {
                const bookDto: IBook = mapBookEntityToDto(book);
                return res.json(bookDto);
            }
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })
}

export function getBooks(req: any, res: any) {
    const books = Book.createQueryBuilder('books')
                        .select('books')
                        .orderBy('books.bookName', "ASC")
                        .getMany();
    books.then((booksData: Book[]) => {
        if(!booksData || booksData.length == 0) {
            const successDto: ISuccess = getCustomSuccessObj(
                "NO BOOKS AVAILABLE",
                "Please add any Book to get the data",
                200
            )
            return res.json(successDto);
        } else {
            const booksDto: IBook[] = booksData.map((b: Book) => mapBookEntityToDto(b));
            return res.json(booksDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })
}

export function updateBook(req: any, res: any) {
    const book = {
        bookId: req.body?.bookId,
        bookName: req.body?.bookName,
        authorId: req.body?.authorId,
        availableStock: req.body?.availableStock,
        bookType: req.body?.bookType
    }

    Book.update({id: book.bookId}, {
        bookName: book.bookName,
        availableStock: book.availableStock,
        bookType: book.bookType,
        author_id: book.authorId
    }).then((updatedBook: UpdateResult) => {
        return res.json(updatedBook);
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })
}

export function updateAvailableStock(bookId: number, subscribedStock: number) {
    getBook(bookId).then((book: Book | null) => {
        if(book) {
            book.availableStock = book.availableStock - subscribedStock;
            book.save().then((updatedBook: Book) => {
                console.log(updatedBook);
            })
            .catch((error: Error) => {
                console.log(error);
            })
        }
    })
    .catch((error: Error) => {
        console.log(error);
    })
}