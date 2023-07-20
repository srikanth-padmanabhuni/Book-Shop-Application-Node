// Interfaces

export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    userName: string;
    password?: string;
    role: string;
    active?: boolean;
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoggedInAt?: Date;
}

export interface IBook {
    id?: number;
    bookName: string;
    author_id: number;
    createdAt?: Date;
    updatedAt?: Date;
    availableStock: number;
    bookType: BookType
}

export interface ISubscription {
    id?: number;
    user_id: number;
    book_id: number;
    subscribedOn?: Date;
    validTill?: Date;
    updatedAt?: Date;
}

export interface IError {
    message: string;
    statusCode: number;
    name: string;
}

export interface ISuccess {
    message: string;
    statusCode: number;
    name: string;
}

// Enums
export enum UserRole {
    ADMIN = "Admin", 
    READER = "Reader", 
    AUTHOR = "Author"
}

export enum BookType {
    NOVEL = "Novel", 
    COMIC = "Comic", 
    HORROR = "Horror", 
    EPIC = "Epic", 
    AUTO_BIOGRAPHY = "Auto Biography",
    STUDT = "Study"
}