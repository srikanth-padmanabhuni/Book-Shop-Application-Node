import { IError, ISuccess, IUser, UserRole } from "../constants/interfaces";
import { User } from "../entities/User";
import { getCustomErrorObj, getCustomSuccessObj, mapUserEntityToDto } from "../mappers/mapper";
import { authenticateUser, createToken, verifyToken } from "../utilities/helpers";

export function login(req: any, res: any) {
    if(req && req.body) {
       let userName = req.body.userName;
       let password = req.body.password;
       authenticateUser(userName, password).then((user: User | null) => {
        if(!user) {
            const errorDto: IError = getCustomErrorObj("INVALID CREDENTIALS", "Username and Password doesnt match", 401);
            res.json(errorDto);
        } else {
            user.lastLoggedInAt = new Date();
            user.save().then((userSaved: User) => {
                console.log("Updated lastLoggedInAt for user with id : " + user.id);
            },(error: Error) => {
                console.log(error);
            })
            const userDto: IUser = mapUserEntityToDto(user);
            const jwtToken = createToken(userDto);
            const body: any = {
                "token": jwtToken
            }
            const successDto: ISuccess = getCustomSuccessObj("Authenticated Successfully", body, 200);
            return res.json(successDto);
        }
       }, (error: Error) => {
            console.log(error);
            const errorDto: IError = getCustomErrorObj("UNABLE TO AUTHENTICATE CREDENTIALS", "Username and Password Unable to validate", 500);
            res.json(errorDto);
       })
    }
}

export function validateToken(req: any, res: any, next: any) {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) {
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Please provide valid JWT Token", 401);
        res.json(errorDto);
    }
    verifyToken(token).then((user: any) => {
        if(!user) {
            const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
            res.json(errorDto);
        } else {
            console.log(user);
            req.user = user;
        }
        next();
    }, (error: Error) => {
        console.log(error);
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
        res.json(errorDto);
    })
}

export function validateTokenForAuthor(req: any, res: any, next: any) {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) {
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Please provide valid JWT Token", 401);
        res.json(errorDto);
    }
    verifyToken(token).then((user: any) => {
        if(!user) {
            const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
            res.json(errorDto);
        } else if (user.role != UserRole.AUTHOR.toString()) {
            const errorDto: IError = getCustomErrorObj("AUTHORISATION ERROR", "You dont have access to do this operation", 401);
            res.json(errorDto);
        } else {
            console.log(user);
            req.user = user;
        }
        next();
    }, (error: Error) => {
        console.log(error);
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
        res.json(errorDto);
    })
}

export function validateTokenForReader(req: any, res: any, next: any) {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) {
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Please provide valid JWT Token", 401);
        res.json(errorDto);
    }
    verifyToken(token).then((user: any) => {
        if(!user) {
            const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
            res.json(errorDto);
        } else if (user.role != UserRole.READER.toString()) {
            const errorDto: IError = getCustomErrorObj("AUTHORISATION ERROR", "You dont have access to do this operation", 401);
            res.json(errorDto);
        } else {
            console.log(user);
            req.user = user;
        }
        next();
    }, (error: Error) => {
        console.log(error);
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
        res.json(errorDto);
    })
}

export function validateTokenForAdmin(req: any, res: any, next: any) {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) {
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Please provide valid JWT Token", 401);
        res.json(errorDto);
    }
    verifyToken(token).then((user: any) => {
        if(!user) {
            const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
            res.json(errorDto);
        } else if (user.role != UserRole.ADMIN.toString()) {
            const errorDto: IError = getCustomErrorObj("AUTHORISATION ERROR", "You dont have access to do this operation", 401);
            res.json(errorDto);
        } else {
            console.log(user);
            req.user = user;
        }
        next();
    }, (error: Error) => {
        console.log(error);
        const errorDto: IError = getCustomErrorObj("INVALID TOKEN", "Token is not Valid", 401);
        res.json(errorDto);
    })
}