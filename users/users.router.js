const { Router } = require('express');

const { createUser, loginUser, getUsers, getCurrentUser,
    logOut, } = require('./users.controller');

const { validateCreateUser, validateLoginUser } = require('../helpers/validate');

const { authorize } = require('./users.middleware');

const usersRouter = Router();

usersRouter.get('/', getUsers);

usersRouter.post('/register', validateCreateUser, createUser);

usersRouter.post('/login', validateLoginUser, loginUser);

usersRouter.get('/users/current', authorize, getCurrentUser);

usersRouter.post('/logout', authorize, logOut)

module.exports = usersRouter;