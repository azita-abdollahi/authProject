import { NextFunction, Request, Response } from "express";
import * as userService from '../services/user.service';
import { AuthorizeException } from "../utils/appError";
import redisClient from "../utils/connectRedis";
import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let access_token;
        if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
            access_token = req.headers.authorization.split(' ')[1];
        } else if ( req.cookies.access_token ) {
            access_token = req.cookies.access_token;
        }
        if ( !access_token ) {
            res.statusCode = 401;
            return next(new AuthorizeException('You are not logged in'));
        }
        const decode = verifyJwt<{sub: string}>(access_token);
        if ( !decode ) {
            res.statusCode = 401;
            return next(new AuthorizeException(`Invalid token or user doesn't exist`));
        }
        const session = await redisClient.get(decode.sub);
        if ( !session ) {
            res.statusCode = 401;
            return next(new AuthorizeException(`User session has expired`));
        }
        const user = await userService.getUserById(JSON.parse(session)._id);
        if (!user) {
            res.statusCode = 401;
            return next(new AuthorizeException(`User with that token no longer exist`));
        }
        res.locals.user = user;
        next();
    } catch (error: any) {
        next(error);
    }
}


