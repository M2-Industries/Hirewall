import express, { Application, Request, Response, NextFunction } from 'express';
const actionRouter = express.Router();
// import action controller when it's done

// get all actions
actionRouter.get('/',
  // invoke the middleware function for getting all actions
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.allActions)
  }
)

// create an action
actionRouter.post('/',
  // invoke the middleware function for creating an action
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.newAction)
  }
)

// delete an action
actionRouter.delete('/:id',
  // invoke the middleware function for deleting an action
  (req: Request, res: Response) => {
    return res.status(204);
  }
)

// edit an application
actionRouter.patch('/:id',
  // invoke the middleware function for updating an action
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.updatedAction)
  }
)

export default actionRouter
