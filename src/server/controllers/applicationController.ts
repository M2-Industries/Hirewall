import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import connection from '../models/dbmodel';

type Controller = {
  createApplication?: any;
  getApplications?: any;
  deleteApplication?: any;
  updateApplication?: any;
};
const applicationController: Controller = {};

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

applicationController.createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id, company, location, job_title, salary, comments } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // get current datetime string
  let application_id;
  let action_id;

  try {
    // Insert new application into the applications table
    const applicationQuery = `INSERT INTO applications (user_id, company, location, job_title, salary, comments) 
      VALUES ('${user_id}', '${company}', '${location}', '${job_title}', '${salary}', '${comments}');`;
    const applicationResult: any = await query(applicationQuery);
    application_id = applicationResult.insertId;

    // Insert new action into the actions table
    const actionQuery = `INSERT INTO actions (application_id_fk, date, action_type, notes) 
      VALUES ('${application_id}', '${date}', 'Created', 'New application created.');`;
    const actionResult: any = await query(actionQuery);
    action_id = actionResult.insertId;

    // Update last_action_id_fk in the applications table to point to the newly created action
    const updateQuery = `UPDATE applications SET last_action_id_fk = ${action_id} WHERE _id = ${application_id};`;
    await query(updateQuery);

    // Return success response with the newly created application and action IDs
    res.status(200).json({
      success: true,
      application_id,
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

applicationController.getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const userId = req.params.user_id;
  const userId = res.locals._id;
  try {
    const result: any = await query(
      `SELECT _id, company, location, job_title, salary, last_action_id_fk, comments FROM applications WHERE user_id = ${userId};`
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server error' });
  }
};

applicationController.deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const applicationId = req.params.application_id;

  try {
    // Begin a transaction to ensure all operations succeed or fail together
    await connection.beginTransaction();

    // Set last_action_id_fk to NULL in the applications table

    await connection.query(
      `UPDATE applications SET last_action_id_fk = NULL WHERE _id = ${applicationId};`
    );

    // Delete all actions associated with the provided application_id
    const deleteActionsQuery = `DELETE FROM actions WHERE application_id_fk = ${applicationId};`;
    await connection.query(deleteActionsQuery);

    // Delete the application with the provided application_id
    const deleteApplicationQuery = `DELETE FROM applications WHERE _id = ${applicationId};`;
    await connection.query(deleteApplicationQuery);

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

applicationController.updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const applicationId = req.params.application_id;
  const { company, location, job_title, salary, comments } = req.body;

  try {
    // Update the application with the provided application_id
    const updateApplicationQuery = `UPDATE applications SET company = ?, location = ?, job_title = ?, salary = ?, comments = ? WHERE _id = ?;`;
    await connection.query(updateApplicationQuery, [
      company,
      location,
      job_title,
      salary,
      comments,
      applicationId,
    ]);

    // Retrieve the updated application
    // const getUpdatedApplicationQuery = `SELECT _id, company, location, job_title, salary, comments FROM applications WHERE _id =${applicationId};`;
    const result: any = await query(
      `SELECT _id, company, location, job_title, salary, comments FROM applications WHERE _id =${applicationId};`
    );

    // Assign the updated application to res.locals.updatedApp
    res.locals.updatedApp = result[0];
    console.log(res.locals.updateApp);

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

export default applicationController;
