import { Router } from 'express';

import Controller from '../controllers/User';

const {
  signup, login, setJWT, dispatchResponse, auth, createOne,
  listAll, getOne, updateOne, deleteOne,
} = new Controller();

const authRouter = Router();
const userRouter = Router();

authRouter.post('/signup', [signup, setJWT], dispatchResponse);
authRouter.post('/login', [login, setJWT], dispatchResponse);

userRouter.route('/')
  .post(createOne, dispatchResponse)
  .get(listAll, dispatchResponse);

userRouter.route('/:id')
  .get(getOne, dispatchResponse)
  .put(updateOne, dispatchResponse)
  .delete(deleteOne, dispatchResponse);

export default {
  authRouter, auth, userRouter,
};
