const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const CatchAsync = require('./../utils/CatchAsync');
const jwt = require('jsonwebtoken');
const Token = require('./../utils/Token');
const bcrypt = require('bcryptjs');
exports.getAllUsers = CatchAsync(async (req, res, next) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const skip = page * limit - limit;
    const users = await User.find({}, {"__v":false,"password": false}).skip(skip).limit(parseInt(limit));
    res.json({
        status: 'success',
        data: users 
    });
});
exports.register = CatchAsync(async (req, res, next) => {
    const userExists = await User.findOne({ email: req.body.email });
    if(userExists) return next(new AppError('User already exists', 400));

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({...req.body, password: hashedPassword });
    const token = await Token.createToken({email: newUser.email, id: newUser._id, roles: newUser.role});
    res.status(201).json({
        status: 'success',
        token
    });
});
exports.login = CatchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email },{"password":false}).select('+password');
    const matchedPassword = bcrypt.compare(user.password, password)
    if(!user || !(matchedPassword)) {
        return next(new AppError('Incorrect email or password', 401));
    }
    const token = await Token.createToken({email: user.email, id: user._id, role: user.role});
    res.json({
        status: 'success',
        user,
        token
    });
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) return next(new AppError('You do not have permission to perform this action.', 403));
        next();
    };
};
exports.getUser = CatchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return next(new AppError('No user found with that ID', 404));
    res.json({
        status: 'success',
        data: user
    });
});

exports.createUser = CatchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: user
    });
});

exports.updateUser = CatchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!user) return next(new AppError('No user found with that ID', 404));
    res.json({
        status: 'success',
        data: user
    });
});

exports.deleteUser = CatchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return next(new AppError('No user found with that ID', 404));
    res.json({
        status: 'success',
        message: 'User deleted successfully'
    });
});

// exports.updateUserData = CatchAsync(async (req, res, next) => {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if(!updatedUser) return next(new AppError('No user found with that ID', 404));
//     res.json({
//         status: 'success',
//         data: updatedUser
//     });
// });

// exports.protect = async (req, res, next) => {
//     let token;
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     }
//     if(!token) return next(new AppError('You are not logged in. Please log in to access this route.', 401));
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if(!user) return next(new AppError('The user belonging to this token no longer exists.', 401));
//     if(user.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed their password. Please log in again.', 401));
//     req.user = user;
//     next();
// };

// exports.logout = (req, res, next) => {
//     req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
//     req.user.save();
//     res.send({ message: 'Logged out successfully' });
// };