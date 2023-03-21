import express, { Application, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import cors from 'cors';
const app: Application = express();
const PORT: number = 3000;

//Define the error object type to use
type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

//parse incoming requests to json
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// statically serve everything in the build folder on the route '/build'
app.use('/', express.static(path.join(__dirname, '../dist')));

// serve index.html on the route '/'
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../dist/index.html'));
});

// app.use('/setup', setupRouter);
// app.use('/clusterdata', clusterRouter);
// app.use('/grafana', grafanaRouter);

// app.use('/alerts', alertsRouter);

// // catch all

// // global err handler

//404 catch all error handler
app.use('/**', (req, res) => res.status(404).send('file not found'));

//global error handler
app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT.toString(), () =>
  console.log(`Server listening on port ${PORT}`)
);

export default app;
