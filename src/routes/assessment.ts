import { Router } from 'express';

import Controller from '../controllers/Assessment';
import userRoutes from './user';

const {
  dispatchResponse, createOne, listAll, verifyOne, getOne,
  updateOne, deleteOne, isOwner,
} = new Controller();

const assessmentRouter = Router();

assessmentRouter.get('/', listAll, dispatchResponse);

assessmentRouter.post('/', [userRoutes.isRestricted, createOne], dispatchResponse);

assessmentRouter.use('/:id', verifyOne);
assessmentRouter.get('/:id', getOne, dispatchResponse);

assessmentRouter.use(userRoutes.isRestricted);

assessmentRouter.route('/:id')
  .put([isOwner('mentor'), updateOne], dispatchResponse)
  .delete([isOwner('mentor'), deleteOne], dispatchResponse);

assessmentRouter.use('/:id/admin', userRoutes.isAdmin);

assessmentRouter.route('/:id/admin')
  .put(updateOne, dispatchResponse)
  .delete(deleteOne, dispatchResponse);

export default assessmentRouter;
