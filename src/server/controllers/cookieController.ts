const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const expiresIn: number = 7 * 60 * 60 * 24;

type cookieControllerType = {
  setCookie: (req: Request, res: Response, next: NextFunction) => void;
  verifyCookie: (req: Request, res: Response, next: NextFunction) => void;
  removeCookie: (req: Request, res: Response, next: NextFunction) => void;
};

const cookieController: cookieControllerType = {
  // set session cookie with JWT
  setCookie(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = res.locals;
      const sessionToken = jwt.sign({ _id }, secret, { expiresIn });
      res.cookie('sessionToken', sessionToken, { httpOnly: true });
      return next();
    } catch (err: any) {
      console.log(err);
      next(err);
    }
  },

  // verify JWT from session cookie
  verifyCookie(req: Request, res: Response, next: NextFunction) {
    // Check if session token exists
    try {
      if (!req.cookies.sessionToken) {
        return next({
          log: 'Error in cookieController.verifyCookie (failed to extract cookie)',
          status: 401,
          message: { err: 'User is not authenticated.' },
        });
      }
      // Decode token
      const { sessionToken } = req.cookies;
      jwt.verify(
        sessionToken,
        secret,
        (err: Error, decoded: { _id: number }) => {
          // if verification fails, return error
          if (err) {
            return next({
              log: 'Error in cookieController.verifyCookie (failed to verify token)',
              status: 401,
              message: { err: 'User is not authenticated.' },
            });
          }
          // if verification succeeds, add ID to res.locals and continue
          else {
            res.locals._id = decoded._id;
            return next();
          }
        }
      );
    } catch (err) {
      console.log(err);
      return next({
        log: 'Error in cookieController.verifyCookie (failed to verify token)',
        status: 501,
        message: { err: 'Server Side error.' },
      });
    }
  },

  // Clear JWT session cookie
  removeCookie(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('sessionToken');
    return next();
  },
};

module.exports = cookieController;
