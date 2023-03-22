import express, { Application, Request, Response, NextFunction } from 'express';
const userRouter = express.Router();
const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');

// Create a new account
userRouter.post(
  '/create',
  userController.validateNewUser,
  userController.createNewUser,
  cookieController.setCookie,
  (req: Request, res: Response) => {
    return res.redirect('/dashboard');
  }
);

// Log in existing user
userRouter.post(
  '/login',
  userController.authenticateUser,
  cookieController.setCookie,
  (req: Request, res: Response) => {
    return res.redirect('/dashboard');
  }
);

// Log out user
userRouter.get(
  '/logout',
  cookieController.removeCookie,
  (req: Request, res: Response) => {
    return res.redirect('/');
  }
);
// // delete an action (mainly for devs for testing purposes)
// userRouter.delete('/:id',
//   // invoke the middleware function for deleting an action
//   (req: Request, res: Response) => {
//     return res.status(204);
//   }
// )

// // edit an application (mainly for devs for testing purposes)
// userRouter.patch('/:id',
//   // invoke the middleware function for updating an action
//   (req: Request, res: Response) => {
//     return res.status(200).json(res.locals.updatedAction)
//   }
// )

export default userRouter;
