import { Router } from 'express';

import userRoutes from './user';

const router = Router();
router.use('/auth', userRoutes.authRouter);
router.use(userRoutes.authUser);
router.use(userRoutes.isAdmin);

export default router;
