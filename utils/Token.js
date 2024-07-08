const jwt = require('jsonwebtoken');
const AppError = require('./AppError');
exports.createToken = async (payload)=> {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return token; 
};

exports.verifyToken = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) return next(new AppError('invalid token',401));

    const token = authHeader.split(' ')[1];
    try {
    const currentUser = currentUser;
    jwt.verify(token, process.env.JWT_SECRET);
    next();
    } catch (error) {
        return next(new AppError('invalid token',401));
    }
};