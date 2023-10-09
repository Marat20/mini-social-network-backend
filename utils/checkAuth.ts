import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId?: string;
}

export default (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  const token = (request.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded: any = jwt.verify(token, 'secret123');

      request.userId = decoded._id;
      next();
    } catch (error) {
      response.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return response.status(403).json({
      message: 'Нет доступа',
    });
  }
};
