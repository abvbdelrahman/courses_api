const Course = require('./../models/courseModel');
const AppError = require('./../utils/AppError');
const CatchAsync = require('./../utils/CatchAsync');
exports.getAllCourses = CatchAsync(async(req, res) => {
   const limit = req.query.limit;
   const page = req.query.page;
   const skip = page * limit - limit;
    const courses = await Course.find().skip(skip).limit(parseInt(limit));
   res.json({ 
      status: 'success',
      data: courses
     });
 });
 exports.getCourse = CatchAsync(async(req, res, next) => {
    const course = await Course.findById(req.params.id)
      res.json({
         status:'success',
         data: course 
      })
      if (!course) return next( new AppError('Course not found!', 400))
 });
 exports.addCourse = CatchAsync(async(req, res, next) => {
   const newCourse = new Course(req.body);
   await newCourse.save()
   if (!newCourse) return next( new AppError('Course not found!', 400))
 });
 exports.updateCourse = CatchAsync(async(req, res, next) => {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
       .then(course => res.json({
         status: 'success',
         message: 'Course updated successfully',
         data: updatedCourse
       }))
       if (!updatedCourse) return next( new AppError('Course not found!', 400))
 });
exports.deleteCourse = CatchAsync(async(req, res, next) =>{
   const course = await Course.findByIdAndDelete(req.params.id)
      res.json({
         status: 'success',
         message: 'Course deleted successfully' 
      });
      if (!course) return next( new AppError('Course not found!', 400))
 });

