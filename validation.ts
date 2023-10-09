import { body } from 'express-validator';

const registerValidator = [
  body('email', 'Неверно указан email').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({
    min: 6,
  }),
  body('fullName', 'Имя пользователя должно быть минимум 2 буквы').isLength({
    min: 2,
  }),
  body('profilePhoto', 'Неверно указана ссылка').optional().isURL(),
];

const loginValidator = [
  body('email', 'Неверно указан email').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({
    min: 6,
  }),
];

const postValidator = [
  body('text', 'Введите текст').isLength({ min: 1 }),
  body('picture', 'Неверно указана ссылка').optional().isURL( ),
];

export { loginValidator, registerValidator, postValidator };
