import { BookType, IBook, IError, ISubscription, ISuccess, IUser, UserRole } from "../constants/interfaces";
import { Book } from "../entities/Book";
import { Subscription } from "../entities/Subscription";
import { User } from "../entities/User";

export function mapUserEntityToDto(user: User): IUser {
    const userDto: IUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        role: user.role,
        active: user.active,
        deleted: user.deleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoggedInAt: user.lastLoggedInAt,
    }

    return userDto;
}

export function mapBookEntityToDto(book: Book) {
    const bookDto: IBook = {
        id: book.id,
        bookName: book.bookName,
        author_id: book.author_id,
        availableStock: book.availableStock,
        bookType: BookType[book.bookType as keyof typeof BookType],
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
    }

    return bookDto;
}

export function mapSubscriptionEntityToDto(subscription: Subscription) {
    const subscriptionDto: ISubscription = {
        id: subscription.id,
        book_id: subscription.book_id.id,
        user_id: subscription.user_id.id,
        subscribedOn: subscription.subscribedOn,
        updatedAt: subscription.updatedAt,
        validTill: subscription.validTill
    }
    return subscriptionDto;
}

export function getErrorObj(error: Error) {
    const errorDto: IError = {
        message: error.message,
        statusCode: 500,
        name: error.name
    }
    return errorDto;
}

export function getCustomErrorObj(name: string, error: string, statusCode: number) {
    const errorDto: IError = {
        message: error,
        statusCode: statusCode,
        name: name
    }
    return errorDto;
}

export function getCustomSuccessObj(name: string, success: string, statusCode: number) {
    const successDto: ISuccess = {
        message: success,
        statusCode: statusCode,
        name: name
    }
    return successDto;
}