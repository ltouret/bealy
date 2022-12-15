import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import travelRouter from './api/travel';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(bodyParser.json());

// useless maybe add easter egg here?
app.get('/alive', (req: Request, res: Response) => {
  res.status(200).json({data : "good"})
});

app.use('/travel', travelRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});