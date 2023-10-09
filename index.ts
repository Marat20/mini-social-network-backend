import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { registerValidator, loginValidator, postValidator } from './validation';
import checkAuth from './utils/checkAuth';
import { getMe, getUser, login, register } from './controllers/UserContoller';
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
} from './controllers/PostController';
import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors';
import cors from 'cors';

dotenv.config();

if (process.env.API_KEY_MONGO_DB)
  mongoose
    .connect(process.env.API_KEY_MONGO_DB)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('Error', err));

const app: Express = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use('/upload', express.static('upload'));

const storage = multer.diskStorage({
  destination(_, __, callback) {
    callback(null, 'upload');
  },
  filename(_, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

// Авторизация и регистрация
app.get('/login/me', checkAuth, getMe);
app.post('/login', loginValidator, handleValidationErrors, login);
app.post('/register', registerValidator, handleValidationErrors, register);
app.get('/user/:userId', getUser);

// Посты
app.get('/posts', getPosts);
app.post(
  '/posts',
  checkAuth,
  postValidator,
  handleValidationErrors,
  createPost
);
app.delete('/posts/:id', checkAuth, deletePost);
app.put('/posts/like/:id', checkAuth, likePost);

// Загрузка изображений
app.post(
  '/upload',
  upload.single('image'),
  (request: Request, response: Response) => {
    response.json({
      url: `/upload/${request.file?.originalname}`,
    });
  }
);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
