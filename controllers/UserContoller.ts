import jwt from 'jsonwebtoken';
import UserSchema from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../interfaces/App.interface';

const register = async (request: Request, response: Response) => {
  try {
    const password: string = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserSchema({
      email: request.body.email,
      fullName: request.body.fullName,
      profilePhoto: request.body.profilePhoto,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    response.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Ошибка',
    });
  }
};

const login = async (request: Request, response: Response) => {
  try {
    const user = await UserSchema.findOne({ email: request.body.email });

    if (!user) {
      return response.status(400).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPassword = await bcrypt.compare(
      request.body.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return response.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    if (!process.env.SECRET_KEY) {
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '30d',
      }
    );

    response.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Ошибка',
    });
  }
};

const getMe = async (request: AuthRequest, response: Response) => {
  try {
    const user = await UserSchema.findById(request.userId);

    if (!user) {
      return response.status(400).json({
        message: 'Пользователь не найден',
      });
    }

    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.params.userId;

    const user = await UserSchema.findById(userId);

    if (!user) {
      return response.status(400).json({
        message: 'Пользователь не найден',
      });
    }

    response.json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export { register, login, getMe, getUser };
