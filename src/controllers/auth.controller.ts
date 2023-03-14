import conf from "config";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import * as userService from "../services/user.service";
import MongoException, { AuthorizeException, NotFoundException } from '../utils/appError'
import { config } from "dotenv";
config();

export const excludedFields = ['password'];
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + conf.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: conf.get<number>('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };
  
  if (process.env.NODE_ENV === 'production')
    accessTokenCookieOptions.secure = true;
  
export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (err.code === 1100 && err instanceof MongoException) {
        res.statusCode = 409
        throw new MongoException("Email already exist")
    }
    next(err);
  }
};

export const loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await userService.findUser({ email: req.body.email });
      if (!user) {
        res.statusCode = 404;
        return next(new NotFoundException('User Not Found'));
      }
      if (!(await user.comparePassword(req.body.password))) {
        res.statusCode = 401;
        return next(new AuthorizeException('unauthorized'))
      }

      const { accessToken } = await userService.signToken(user);
      res.cookie('accessToken', accessToken, accessTokenCookieOptions);
      res.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      res.status(200).json({
        status: 'success',
        accessToken,
      });
    } catch (err: any) {
      next(err);
    }
};

