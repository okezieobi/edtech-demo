import { Router } from 'express';

import userRouter from './user';
import assessmentRouter from './assessment';

const router = Router();
router.use('/auth', userRouter.authRouter);
router.use(userRouter.auth);
router.use('/users', userRouter.userRouter);
// router.use('/assessments', assessmentRouter);

export default router;
