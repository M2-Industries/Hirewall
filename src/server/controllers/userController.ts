const bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';
const db = require('../models/dbmodel');

type userControllerType = {
  validateNewUser: (req: Request, res: Response, next: NextFunction) => void;
  createNewUser: (req: Request, res: Response, next: NextFunction) => void;
  authenticateUser: (req: Request, res: Response, next: NextFunction) => void;
};

const SALT_WORK_FACTOR: number = 15;
const userController: userControllerType = {
  validateNewUser(req, res, next) {
    if (!req.body.email || !req.body.password) {
      // if missing email or password, return error
      return next({ error: 'Please provide email and password' });
    } else {
      const { email } = req.body;
      db.query('SELECT * FROM users WHERE email = $1', [email])
        .then((result) => {
          // if user already exists, return error
          if (result.rows[0])
            return next({ log: 'error: email already exists' });
          // if valid, continue to createNewUser
          else {
            return next();
          }
        })
        .catch((err: Error) => {
          return next({
            log: 'DB error while checking for duplicate email in userController.validateNewUser',
            error: err,
          });
        });
    }
  },

  createNewUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    // hash password to store in DB
    bcrypt.hash(password, 15, (err: Error, hashedPassword: string) => {
      // on bcrypt error, return error
      if (err)
        return next({
          log: 'error hashing password in userController.createNewUser',
          error: err,
        });
      // if bcrypt succeeds, create new user in database
      db.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING _id',
        [email, hashedPassword]
      )
        .then((result) => {
          res.locals.userId = result.rows[0];
          return next();
        })
        .catch((err: Error) => {
          return next({
            log: 'DB error while checking for duplicate email in userController.validateNewUser',
            error: err,
          });
        });
    });
  },

  authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    let hashedPassword: string = '';
    let userId: number = 0;
    // get hashed password from DB
    db.query('SELECT password, _id FROM users WHERE email = $1', [email])
      .then((result) => {
        // if valid response, save hashedPassword and userID
        if (result.rows[0]) {
          hashedPassword = result.rows[0].password;
          userId = result.rows[0]._id;
        }
      })
      // check if password matches
      .then(
        bcrypt.compare(password, hashedPassword, (isMatch: boolean) => {
          // if yes, return userId
          if (isMatch) {
            res.locals.userId = userId;
            return next();
          }
          // otherwise, return error
          else {
            return next({ log: 'error: incorrect email or password' });
          }
        })
      );
  },
};

module.exports = userController;
