const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
const secret = process.env.JWT_SECRET;

type cookieControllerType = {
  setCookie: (req: Request, res: Response, next: NextFunction) => void;
  verifyCookie: (req: Request, res: Response, next: NextFunction) => void;
  removeCookie: (req: Request, res: Response, next: NextFunction) => void;
};

const cookieController: cookieControllerType = {
  // set session cookie with JWT
  setCookie(req, res, next) {
    const { _id } = res.locals;
    const sessionToken = jwt.sign({ _id }, secret);
    res.cookie('sessionToken', sessionToken, { httpOnly: true });

    return next();
  },

  // verify JWT from session cookie
  verifyCookie(req, res, next) {
    // Check if session token exists
    if (!req.cookies.sessionToken) {
      return next({
        log: 'Error in cookieController.verifyCookie (failed to extract cookie)',
        status: 401,
        message: { err: 'User is not authenticated.' },
      });
    }
    // Decode token
    const { sessionToken } = req.cookies;
    jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
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
    });
  },

  // Clear JWT session cookie
  removeCookie(req, res, next) {
    res.clearCookie('sessionToken');
    return next();
  },
};

module.exports = cookieController;
