import { DataSource } from "typeorm"
import dotenv from 'dotenv';

dotenv.config();

export const myDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_HOST,
    entities: ["./dist/api/*/*.js"],
    logging: true,
    synchronize: true,
})