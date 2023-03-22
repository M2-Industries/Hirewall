import express, { Application, Request, Response, NextFunction } from 'express';
const userRouter = express.Router();
// import action controller when it's done

// // get all users (mainly for devs for testing purposes)
// userRouter.get('/',
//   // invoke the middleware function for getting all actions
//   (req: Request, res: Response) => {
//     return res.status(200).json(res.locals.allActions)
//   }
// )

// // get a specific user
// userRouter.get('/:id',
//   // invoke the middleware function for getting all actions
//   (req: Request, res: Response) => {
//     return res.status(200).json(res.locals.allActions)
//   }
// )

// Create a new account
userRouter.post('/create',
  // invoke the middleware function for creating an action
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.newUser)
  }
)
// Log in existing user
userRouter.post('/login',
  // invoke the middleware function for creating an action
  (req: Request, res: Response) => {
    return res.status(201).json()
  }
)

// Log out user
userRouter.get('/logout',
  // invoke the middleware function for creating an action
  (req: Request, res: Response) => {
    return res.status(201).json()
  }
)

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

export default userRouter
