import express, { Application, Request, Response, NextFunction } from 'express';
import applicationController from '../controllers/applicationController';
// import cookieController from '../controllers/cookieController';
const cookieController = require('../controllers/cookieController');
const applicationRouter = express.Router();
// import application controller when it's done

// get all applications
applicationRouter.get(
  '/',
  cookieController.verifyCookie,
  applicationController.getApplications,
  // invoke the middleware function for getting all applications
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.allApps);
  }
);

// create an application
applicationRouter.post(
  '/',
  applicationController.createApplication,
  // invoke the middleware function for creating an application
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.newApp);
  }
);

// delete an application
applicationRouter.delete(
  '/:application_id',
  applicationController.deleteApplication,
  // invoke the middleware function for deleting an application
  (req: Request, res: Response) => {
    return res.status(204);
  }
);

// edit an application
applicationRouter.patch(
  '/:application_id',
  applicationController.updateApplication,
  // invoke the middleware function for updating an application
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.updatedApp);
  }
);

export default applicationRouter;
