const express = require('express');
const courseController = require('./../controllers/courseController');
const userController = require('./../controllers/userController');
const userRouter = require('./userRouter');
const Token = require('../utils/Token');
const router = express.Router();

router
    .route('/')
    .get(userController.login, courseController.getAllCourses)
     .post(userController.login,courseController.addCourse);

router
    .route('/:id')
    .get(Token.verifyToken, courseController.getCourse)
    .patch(Token.verifyToken, userController.restrictTo('ADMIN'),courseController.updateCourse)
    .delete(Token.verifyToken, userController.restrictTo('ADMIN','MANAGER'),courseController.deleteCourse);

module.exports = router;