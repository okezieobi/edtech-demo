import { Router } from 'express';

import Controller from '../controllers/User';

const {
  signup, login, setJWT, dispatchResponse, auth,
} = new Controller();

const authRouter = Router();

authRouter.post('/signup', [signup, setJWT], dispatchResponse);
authRouter.post('/login', [login, setJWT], dispatchResponse);

export default { authRouter, auth, isAdmin: Controller.isAdmin };
