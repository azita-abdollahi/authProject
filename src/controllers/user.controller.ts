import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';
import { NotFoundException } from '../utils/appError';


export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserById = async (
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {
    try {
      const user = await userService.getUserById(req.body.userId);
      if (!user) {
        res.statusCode = 404;
        return next(new NotFoundException('User Not Found'));
      }
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
        next(err);
    }
  };
  
  export const updateUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    try {
      const user = await userService.updateUser(req.body.userId, req.body);
      if (!user) {
        res.statusCode = 404;
        return next(new NotFoundException('User Not Found'));
      }
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const deleteUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    try {
      const user = await userService.deleteUser(req.body.userId);
      if (!user) {
        res.statusCode = 404;
        return next(new NotFoundException('User Not Found'));
      }
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      next(err)
    }
  };

