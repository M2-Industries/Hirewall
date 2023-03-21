const bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';

type loginControllerType = {
  validateNewUser: (req: Request, res: Response, next: NextFunction) => void;
  createNewUser: (req: Request, res: Response, next: NextFunction) => void;
  authenticateUser: (req: Request, res: Response, next: NextFunction) => void;
};

const SALT_WORK_FACTOR: number = 15;
const loginController: loginControllerType = {
  validateNewUser(req, res, next) {
    if (!req.body.username || !req.body.password) {
      // if missing username or password, return error
      return next({ error: 'Please provide username and password' });
    } else {
      const { username } = req.body;
      db.query('SELECT * FROM users WHERE username = $1', [username])
        .then((result) => {
          // if user already exists, return error
          if (result.rows[0])
            return next({ log: 'error: username already exists' });
          // if valid, continue to createNewUser
          else {
            return next();
          }
        })
        .catch((err: Error) => {
          return next({
            log: 'DB error while checking for duplicate username in loginController.validateNewUser',
            error: err,
          });
        });
    }
  },

  createNewUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    // hash password to store in DB
    bcrypt.hash(password, 15, (err: Error, hashedPassword: string) => {
      // on bcrypt error, return error
      if (err)
        return next({
          log: 'error hashing password in loginController.createNewUser',
          error: err,
        });
      // if bcrypt succeeds, create new user in database
      db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING _id',
        [username, hashedPassword]
      )
        .then((result) => {
          res.locals.userId = result.rows[0];
          return next();
        })
        .catch((err: Error) => {
          return next({
            log: 'DB error while checking for duplicate username in loginController.validateNewUser',
            error: err,
          });
        });
    });
  },

  authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    let hashedPassword: string = '';
    let userId: number = 0;
    // get hashed password from DB
    db.query('SELECT password, _id FROM users WHERE username = $1', [username])
      .then((result) => {
        if (result.rows[0]) {
          hashedPassword = result.rows[0].password;
          userId = result.rows[0]._id;
        } else {
          return next({ log: 'error: incorrect username or password' });
        }
      })
      .then(
        bcrypt.compare(password, hashedPassword, (isMatch: boolean) => {
          if (isMatch) {
            res.locals.userId = userId;
            return next();
          } else {
            return next({ log: 'error: incorrect username or password' });
          }
        })
      );
  },
};
