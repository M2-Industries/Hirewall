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

const query = (queryString: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    connection.query(queryString, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

actionController.createAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { application_id_fk, action_type, notes } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // get current datetime string
  let action_id;

  try {
    // Insert new action into the applications table
    const actionQuery = `INSERT INTO actions (application_id_fk, date, action_type, notes) 
        VALUES ('${application_id_fk}', '${date}', '${action_type}', '${notes}');`;
    const actionResult: any = await query(actionQuery);
    action_id = actionResult.insertId;

    // Update last_action_id_fk in the applications table to point to the newly created action
    const updateQuery = `UPDATE applications SET last_action_id_fk = ${action_id} WHERE _id = ${application_id_fk};`;
    await query(updateQuery);

    // Return success response with the newly created application and action IDs
    res.status(200).json({
      success: true,
      application_id_fk,
      action_id,
    });
  } catch (error) {
    console.error('Error adding application:', error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};
