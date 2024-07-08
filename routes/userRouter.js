const express = require('express');
const multer = require('multer');

const userController = require('./../controllers/userController');
const Token = require('./../utils/Token');
const Router = express.Router();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${Date.now()}.${ext}`);
  }
});
const filefilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'), false);
    }
  };

const upload = multer({ 
    storage: multerStorage,
    filefilter
}
);

Router
    .route('/')
    .get(Token.verifyToken,userController.getAllUsers)
Router
    .route('/register')
    .post(upload.single('avatar'), userController.register)

Router
    .route('/login')
    .post(userController.login)

// Router
//     .route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser)

module.exports = Router;