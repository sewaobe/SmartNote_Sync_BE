import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import AuthRoute from './routes/AuthRoute.js';
import ClassRoute from './routes/ClassRoute.js';
import FileRoute from './routes/FileRoute.js';
import LectureRoute from './routes/LectureRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', AuthRoute);
app.use('/api/classes', ClassRoute);
app.use('/api/files', FileRoute);
app.use('/api/lectures', LectureRoute);

export default app;
