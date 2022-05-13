import { Router } from 'express';

import Controller from '../controllers/User';

const {
  signup, login, setJWT, dispatchResponse, auth,
  listAll, verifyOne, getOne, updateOne, deleteOne,
} = new Controller();

const { isAdmin, isRestricted } = Controller;

const authRouter = Router();
const adminRouter = Router();

authRouter.post('/signup', [signup, setJWT], dispatchResponse);
authRouter.post('/login', [login, setJWT], dispatchResponse);

adminRouter.use(isAdmin);

adminRouter.route('/')
  .post(signup, dispatchResponse)
  .get(listAll, dispatchResponse);

adminRouter.route('/:id')
  .get(getOne, dispatchResponse)
  .put(updateOne, dispatchResponse)
  .delete(deleteOne, dispatchResponse);

export default {
  authRouter, auth, isAdmin, isRestricted, adminRouter,
};
