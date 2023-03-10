import express from "express";
import conf from "config";
import cors from "cors";
import {config} from "dotenv";
config()
import router from "./routes/router";
import connectDB from './utils/connectDB';
import redisClient from "./utils/connectRedis";

const app = express();

app.use(express.json({ limit: '70mb' }));
app.use(
  express.urlencoded({ limit: '70mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: conf.get("origin"), optionsSuccessStatus: 200 }));
app.use("/", router)

const port = conf.get<number>('PORT');

app.listen(port, () => {
    console.log(`${conf.get("name")}\n Listening On Port ${port} `);
    connectDB()
})