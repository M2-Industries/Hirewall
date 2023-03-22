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

actionController.getActions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const application_id_fk = req.params.application_id_fk;

  try {
    const result: any = await query(
      `SELECT _id, date, action_type, notes FROM actions WHERE application_id_fk = ${application_id_fk};`
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server error' });
  }
};

actionController.deleteAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const actionId = req.params.action_id;

  try {
    // Begin a transaction to ensure all operations succeed or fail together
    await connection.beginTransaction();

    //get last_action_id_fk from application;

    //   await connection.query(
    //     `UPDATE applications SET last_action_id_fk = NULL WHERE _id = ${applicationId};`
    //   );

    // Delete all actions associated with the provided application_id
    const deleteActionsQuery = `DELETE FROM actions WHERE _id = ${actionId};`;
    await connection.query(deleteActionsQuery);

    // Delete the application with the provided application_id
    //   const deleteApplicationQuery = `DELETE FROM applications WHERE _id = ${applicationId};`;
    //   await connection.query(deleteApplicationQuery);

    // Commit the transaction
    await connection.commit();

    // Return a success response with a 204 status (No Content)
    res.status(204).json({
      success: true,
      message: 'Application and associated actions deleted successfully',
    });
  } catch (error) {
    // If there was an error, rollback the transaction
    await connection.rollback();

    console.error('Error deleting application and associated actions:', error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

actionController.updateAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const actionId = req.params.action_id;
  const { date, action_type, notes } = req.body;

  try {
    // Update the application with the provided application_id
    const updateActionQuery = `UPDATE actions SET date = ?, action_type = ?, notes = ? WHERE _id = ?;`;
    await connection.query(updateActionQuery, [
      date,
      action_type,
      notes,
      actionId,
    ]);

    // Retrieve the updated application
    // const getUpdatedApplicationQuery = `SELECT _id, company, location, job_title, salary, comments FROM applications WHERE _id =${applicationId};`;
    const result: any = await query(
      `SELECT date, application_id_fk, action_type, notes FROM actions WHERE _id =${actionId};`
    );

    // Assign the updated application to res.locals.updatedApp
    res.locals.updatedAction = result[0];
    console.log(res.locals.updatedAction);

    // Proceed to the next middleware function
    return next();
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

export default actionController;
