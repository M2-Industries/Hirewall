const bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';
import connection from '../models/dbmodel';

type userControllerType = {
  validateNewUser: (req: Request, res: Response, next: NextFunction) => void;
  createNewUser: (req: Request, res: Response, next: NextFunction) => void;
  authenticateUser: (req: Request, res: Response, next: NextFunction) => void;
};

const SALT_WORK_FACTOR: number = 15;
const userController: userControllerType = {
  validateNewUser(req, res, next) {
    if (req.body.email === undefined || req.body.password === undefined) {
      // if missing email or password, return error
      return next({
        log: 'Error in userController.validateNewUser - email or password not provided',
        status: 400,
        message: {
          err: 'Please provide email and password.',
        },
      });
    } else {
      const { email } = req.body;
      connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        function (err: any, result: any, fields: any): any {
          if (err) {
            return next({
              log: 'DB error while checking for duplicate email in userController.validateNewUser',
              status: 503,
              message: {
                err: 'Database connection error, please try again later.',
              },
            });
          }
          // if user already exists, return error
          else if (result[0]) {
            return next({
              log: 'Error in userController.validateNewUser - user with that email already exists',
              status: 409,
              message: {
                err: 'Account with that email address already exists.',
              },
            });
          }
          // if valid, continue to createNewUser
          else {
            return next();
          }
        }
      );
    }
  },

  createNewUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    // hash password to store in DB
    bcrypt.hash(password, 15, (err: Error, hashedPassword: string) => {
      // on bcrypt error, return error
      if (err)
        return next({
          log: 'Error hashing password in userController.createNewUser',
          status: 500,
          message: {
            err: 'Internal servor error, please try again later.',
          },
        });
      // if bcrypt succeeds, create new user in database
      connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function (err: any, result: any, fields: any): any {
          // return DB error if query fails
          if (err) {
            return next({
              log: 'DB error while creating user in userController.createNewUser',
              status: 503,
              message: {
                err: 'Database connection error, please try again later.',
              },
            });
          }
          // if query succeeds, assign id to res.locals and continue
          res.locals.userId = result.insertId;
          return next();
        }
      );
    });
  },

  authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    let hashedPassword: string = '';
    let userId: number = 0;
    // get hashed password from DB
    connection.query(
      'SELECT password, _id FROM users WHERE email = ?',
      [email],
      function (err: any, result: any, fields: any): any {
        // return DB error if query fails
        if (err) {
          return next({
            log: 'DB error while querying in userController.authenticateUser',
            status: 503,
            message: {
              err: 'Database connection error, please try again later.',
            },
          });
        }
        // if valid response, save hashedPassword and userID
        if (result[0]) {
          hashedPassword = result[0].password;
          userId = result[0]._id;
        }
        // check if password matches
        bcrypt.compare(
          password,
          hashedPassword,
          (err: Error, isMatch: boolean) => {
            // if error, return error
            if (err) {
              return next({
                log: 'error in bcrypt.compare function in userController.authenticateUser',
                status: 503,
                message: {
                  err: 'Internal server error, please try again later.',
                },
              });
            }
            // if match, add user id to res.locals and continue
            if (isMatch) {
              res.locals._id = userId;
              return next();
            }
            // otherwise, return error
            else {
              return next({
                log: 'error in userController.authenticateUser: email or password does not match',
                status: 401,
                message: {
                  err: 'Incorrect email or password.',
                },
              });
            }
          }
        );
      }
    );
  },
};

module.exports = userController;
