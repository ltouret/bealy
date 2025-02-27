import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import travelRouter from './api/travel';
import userRouter from './api/travel/user.controller';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { myDataSource } from "./app-data-source"

myDataSource
    .initialize()
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });

dotenv.config();

const app: Express = express();
const port = process.env.BACK_PORT;

app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/alive', (req: Request, res: Response) => {
  res.status(200).json({data : "good"})
});

app.use('/user', userRouter);
app.use('/travel', travelRouter);

app.all('*', (req: Request, res: Response) => {
  return res.status(404).send(`Route ${req.originalUrl} not found`);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});