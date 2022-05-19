import { Router } from 'express';

import Controller from '../controllers/User';

const {
  signup, login, generateJWT, dispatchResponse, auth, createOne,
  listAll, getOne, updateOne, deleteOne, verifyJWT,
} = new Controller();

const authRouter = Router();
const userRouter = Router();

authRouter.post('/signup', [signup, generateJWT], dispatchResponse);
authRouter.post('/login', [login, generateJWT], dispatchResponse);

userRouter.route('/')
  .post(createOne, dispatchResponse)
  .get(listAll, dispatchResponse);

userRouter.route('/:id')
  .get(getOne, dispatchResponse)
  .put(updateOne, dispatchResponse)
  .delete(deleteOne, dispatchResponse);

export default {
  authRouter, auth: [verifyJWT, auth], userRouter,
};
