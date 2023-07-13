import { IError, ISuccess, IUser } from "../constants/interfaces";
import { User } from "../entities/User";
import { getCustomErrorObj, getCustomSuccessObj, getErrorObj, mapUserEntityToDto } from "../mappers/mapper";
import { getUser } from "../utilities/helpers";
import { UpdateResult } from "typeorm";

export function createUser(req: any, res: any) {
    const user = {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        role: req.body?.role,
        userName: req.body?.userName,
        password: req.body?.password
    }

    const userEntity = User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userName: user.userName,
        password: user.password 
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

    const users = User.createQueryBuilder('users')
                    .select('users')
                    .where("users.deleted = false AND users.active = true")
                    .orderBy("users.userName")
                    .getMany();
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