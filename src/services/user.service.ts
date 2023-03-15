import {omit, get} from 'lodash'; 
import {FilterQuery, QueryOptions} from 'mongoose';
import config from 'config';
import User, { IUser } from '../models/user.model';
import { signJwt } from '../utils/jwt';
import redisClient from '../utils/connectRedis';
import { excludedFields } from '../controllers/auth.controller';

export const createUser = async (userData: Partial<IUser>) => {
    const newUser = new User(userData)
    await newUser.save();
    return omit(newUser, excludedFields);
}

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId);
    return omit(user, excludedFields);
};

export const findAllUsers = async () => {
    const user = await User.find();
    return user;
}

export const findUser = async (
    query:FilterQuery<IUser>,
    options: QueryOptions = {}
    ) => {
    const user = await User.findOne(query, {}, options).select('-password');
    return user;
}
  
export const updateUser = async (userId: string, userData: Partial<IUser>) => {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) return null;

    userToUpdate.name = userData.name || userToUpdate.name;
    userToUpdate.email = userData.email || userToUpdate.email;
    userToUpdate.role = userData.role || userToUpdate.role;
    userToUpdate.updatedAt = new Date();

    return userToUpdate.save();
};
  
export const deleteUser = async (userId: string): Promise<boolean> => {
    const deletedUser = await User.findByIdAndDelete(userId);
    return !!deletedUser;
};

export const signToken =async (user:IUser) => {
    const accessToken = signJwt (
        {   sub: user._id },
        {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        }
    );
    redisClient.set(user._id, JSON.stringify(user), {
        EX: 60 * 60,
      });
    return { accessToken }
}
