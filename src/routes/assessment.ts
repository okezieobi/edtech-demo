import { Router } from 'express';

import Controller from '../controllers/Assessment';
import userRoutes from './user';

const {
  dispatchResponse, createOne, listAll, verifyOne, getOne, updateOne, deleteOne,
} = new Controller();

const { isOwner } = Controller;

const assessmentRouter = Router();

assessmentRouter.get('/', listAll, dispatchResponse);

assessmentRouter.use('/:id', verifyOne);
assessmentRouter.get('/:id', getOne, dispatchResponse);

assessmentRouter.use(userRoutes.isRestricted);

assessmentRouter.post('/', createOne, dispatchResponse);

assessmentRouter.route('/:id')
  .put([isOwner, updateOne], dispatchResponse)
  .delete([isOwner, deleteOne], dispatchResponse);

assessmentRouter.route('/:id/admin')
  .put([userRoutes.isAdmin, updateOne], dispatchResponse)
  .delete([userRoutes.isAdmin, deleteOne], dispatchResponse);

export default assessmentRouter;
