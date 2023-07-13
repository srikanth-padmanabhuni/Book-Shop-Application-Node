import { UserRole } from "../constants/interfaces";
import { Book } from "../entities/Book";
import { Subscription } from "../entities/Subscription";
import { User } from "../entities/User";

export async function getUser(userId: number) {
    return await User.findOne({where: {id: userId}});
}

export async function getBook(bookId: number) {
    return await Book.findOne({where: {id: bookId}});
}

export async function getSubscription(subscriptionId: number) {
    return await Subscription.findOne({where: {id: subscriptionId}});
}

export async function isUserAvailableNdReader(userId: number) {
    const user = await User.findOne({where: {id: userId}});
    if(user && user.active && !user.deleted && user.role == UserRole.READER.toString()) {
        return true;
    } else {
        return false;
    }
}

export async function isBookAvailable(bookId: number) {
    const book = await Book.findOne({where: {id: bookId}});
    if(book) {
        return true;
    } else {
        return false;
    }
}

export async function isSubscriptionAvailable(subscriptionId: number) {
    const subscription = await Subscription.findOne({where: {id: subscriptionId}});
    if(subscription) {
        return true;
    } else {
        return false;
    }
}

export async function isHavingAvailableStock(bookId: number, requiredStock: number) {
    const book = await Book.findOne({where: {id: bookId}});
    if(book && book.availableStock >= requiredStock) {
        return true;
    } else {
        return false;
    }
}