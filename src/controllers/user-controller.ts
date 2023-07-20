import { IError, ISuccess, IUser } from "../constants/interfaces";
import { User } from "../entities/User";
import { getCustomErrorObj, getCustomSuccessObj, getErrorObj, mapUserEntityToDto } from "../mappers/mapper";
import { encryptData, getUser } from "../utilities/helpers";
import { SelectQueryBuilder, UpdateResult } from "typeorm";

export function createUser(req: any, res: any) {
    const user = {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        role: req.body?.role,
        userName: req.body?.userName,
        password: req.body?.password
    }

    const encryptedPassword = encryptData(user.password);

    const userEntity = User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userName: user.userName,
        password: encryptedPassword 
    });

    userEntity
        .save()
        .then((savedUser: User) => {
            const userDto: IUser = mapUserEntityToDto(savedUser);
            return res.json(userDto);
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })

}

export function deleteUser(req: any, res: any) {
    const userId = req.body?.userId;
    getUser(userId)
        .then((user: User | null) => {
            if(!user) {
                const err:IError = getCustomErrorObj(
                    "INVALID USER",
                    "User with given userId is not available",
                    500
                )
                return res.json(err);
            } else {
                user.deleted = true;
                user.active = false;
                user.save()
                    .then((user: User) => {
                        if(user && user.deleted && !user.active) {
                            const successDto: ISuccess = getCustomSuccessObj(
                                "USER DELETED",
                                "User with givenId was deleted Successfully!!!",
                                200
                            )
                            return res.json(successDto);
                        } else {
                            const err:IError = getCustomErrorObj(
                                "USER NOT DELETED",
                                "User with given userId is not deleted Successfully!!!",
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
            }
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })
}

export function getAllUsers(req: any, res: any) {

    let filters;
    if(req.body && req.body.filters) {
        filters = req.body.filters;
    }

    let queryBuilder: SelectQueryBuilder<User> = User.createQueryBuilder('users').select('users');
    if(filters) {
        if(filters.userName && filters.userName.length != 0) {
            const uName = "%"+ filters.userName +"%"
            queryBuilder = queryBuilder.orWhere("users.userName like :userName", {userName: uName});
        }

        if(filters.firstName && filters.firstName.length != 0) {
            const fName = "%"+ filters.firstName +"%"
            queryBuilder = queryBuilder.orWhere("users.firstName like :firstName", {firstName: fName});
        }

        if(filters.lastName && filters.lastName.length != 0) {
            const lName = "%"+ filters.lastName +"%"
            queryBuilder = queryBuilder.orWhere("users.lastName like :lastName", {lastName: lName});
        }
    }

    if(filters.sortBy && filters.sortDirection) {
        queryBuilder = queryBuilder.orderBy(`users.${filters.sortBy}`, filters.sortDirection);
    } else {
        queryBuilder = queryBuilder.orderBy(`users.userName ASC`);
    }

    if(filters.pageNo) {
        queryBuilder = queryBuilder.offset(filters.pageNo).limit(10);
    }

    const users = queryBuilder.getMany();
    users.then((usersData: User[]) => {
        if(usersData && usersData.length != 0) {
            let usersDto: IUser[] = usersData.map((user: User) => mapUserEntityToDto(user));
            return res.json(usersDto);
        } else {
            const successDto: ISuccess = getCustomSuccessObj(
                "NO USERS AVAILABLE",
                "Please add any User to get the data",
                200
            )
            return res.json(successDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })
}

export function getUserById(req: any, res: any) {
    const userId = req.body?.userId;
    getUser(userId)
        .then((user: User | null) => {
            if(!user || user.deleted || !user.active) {
                const err:IError = getCustomErrorObj(
                    "INVALID USER",
                    "User with given userId is not available",
                    500
                )
                return res.json(err);
            } else {
                const userDto: IUser = mapUserEntityToDto(user);
                return res.json(userDto);
            }
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        });
}

export function updateUser(req: any, res: any) {
    const user = {
        userId: req.body?.userId,
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        role: req.body?.role,
        userName: req.body?.userName,
        password: req.body?.password,
        active: req.body?.active,
        deleted: req.body?.deleted
    }

    User.update({id: user.userId}, {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userName: user.userName,
        password: user.password,
        active: user.active,
        deleted: user.deleted
    }).then((updatedUser: UpdateResult) => {
        return res.json(updatedUser);
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

}