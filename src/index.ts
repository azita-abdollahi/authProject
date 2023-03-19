import express, { Request, Response, NextFunction } from "express";
import conf from "config";
import cors, { CorsOptions } from "cors";
import { config } from "dotenv";
config()
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import connectDB from './utils/connectDB';
import { NotFoundException } from "./utils/appError";

const app = express();
  
const corsOption: CorsOptions = {
  origin: conf.get('origin'),
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(express.json({ limit: '70mb' }));
app.use(express.urlencoded({ limit: '70mb', extended: true}));
app.use(cors(corsOption));
app.use(cookieParser());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Best Application;)',
  });
});

app.use((req, res, next) => {
  const err = new NotFoundException(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
const port = conf.get<number>('PORT');

app.listen(port, () => {
    console.log(`${conf.get("name")}\n Listening On Port ${port} `);
    connectDB()
})