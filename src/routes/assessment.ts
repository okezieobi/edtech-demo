import { Router } from 'express';

import Controller from '../controllers/Assessment';
import userRoutes from './user';

const {
  dispatchResponse, createOne, listAll, verifyOne, getOne,
  updateOne, deleteOne, isOwnerMentor, useMentor,
} = new Controller();

const assessmentRouter = Router();

assessmentRouter.get('/', listAll, dispatchResponse);

assessmentRouter.use('/:id', verifyOne);
assessmentRouter.get('/:id', getOne, dispatchResponse);

assessmentRouter.use(userRoutes.isRestricted);

assessmentRouter.post('/', createOne, dispatchResponse);

assessmentRouter.post('/admin', [useMentor, createOne], dispatchResponse);

assessmentRouter.route('/:id')
  .put([isOwnerMentor, updateOne], dispatchResponse)
  .delete([isOwnerMentor, deleteOne], dispatchResponse);

assessmentRouter.use('/:id/admin', userRoutes.isAdmin);

assessmentRouter.route('/:id/admin')
  .put(updateOne, dispatchResponse)
  .delete(deleteOne, dispatchResponse);

export default assessmentRouter;
