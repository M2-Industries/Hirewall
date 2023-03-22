import express, { Application, Request, Response, NextFunction } from 'express';
import actionController from '../controllers/actionController';
const actionRouter = express.Router();
// import action controller when it's done

// get all actions
actionRouter.get(
  '/:application_id_fk',
  actionController.getActions,
  // invoke the middleware function for getting all actions
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.allActions);
  }
);

// create an action
actionRouter.post(
  '/',
  actionController.createAction,
  // invoke the middleware function for creating an action
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.newAction);
  }
);

// delete an action
actionRouter.delete(
  '/:action_id',
  actionController.deleteAction,
  // invoke the middleware function for deleting an action
  (req: Request, res: Response) => {
    return res.status(204);
  }
);

// edit an application
actionRouter.patch(
  '/:action_id',
  actionController.updateAction,
  // invoke the middleware function for updating an action
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.updatedAction);
  }
);

export default actionRouter;
