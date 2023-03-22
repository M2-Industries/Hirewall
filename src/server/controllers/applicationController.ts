import { Request, Response, NextFunction, RequestHandler } from 'express';
import connection from '../models/dbmodel';

type Controller = {
  createApplication?: RequestHandler;
  getApplications?: RequestHandler;
};
const applicationController: Controller = {};

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
    const applicationResult: any = await connection.query(applicationQuery);
    //retrieves the newly added application_id
    application_id = applicationResult.insertId;

    // Insert new action into the actions table
    const actionQuery = `INSERT INTO actions (application_id_fk, date, action_type, notes) 
      VALUES ('${application_id}', '${date}', 'Created', 'New application created.');`;
    const actionResult: any = await connection.query(actionQuery);
    //retrieves the newly added action_id
    action_id = actionResult.insertId;

    // Update last_action_id_fk in the applications table to point to the newly created action
    const updateQuery = `UPDATE applications SET last_action_id_fk = ${action_id} WHERE _id = ${application_id};`;
    await connection.query(updateQuery);

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
  const userId = req.params.user_id;

  try {
    const result: any = await connection.query(
      `SELECT _id, company, location, job_title, salary, last_action_id_fk, comments FROM applications WHERE user_id = ${userId};`
    );

    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server error' });
  }
};

export default applicationController;
