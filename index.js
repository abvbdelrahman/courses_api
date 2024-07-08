const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

const AppError = require('./utils/AppError');
const coursesRouter= require('./routes/couresRouter');
const userRouter= require('./routes/userRouter');

dotenv.config({ path: './.env' });
const app = express();
app.use(cors())
app.use(morgan('dev'));
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use(express.json());
// console.log(process.env.DATABASE_URL);
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log(`DB connection successfull`));
  
  const port = process.env.PORT || 5001;
app.listen(5001, () => {
    console.log(`App running on port ${port}`);
  });

app.use('/api/courses', coursesRouter);
app.use('/api/users', userRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`can not find ${req.originalUrl} on this server`, 404));
  });
