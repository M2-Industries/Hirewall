import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import connection from '../models/dbmodel';

type Controller = {
  createAction?: any;
  getActions?: any;
  deleteAction?: any;
  updateAction?: any;
};
const actionController: Controller = {};
