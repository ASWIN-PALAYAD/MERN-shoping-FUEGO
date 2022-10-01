//its for protecting some route from a non registered users

const ErrorHandeler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


// user login or not
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandeler("Please login for access this resources",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodedData.id);
    next();
});

//Admin roles
exports.authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandeler(`${req.user.role} can not access this resources`));
        };
        next();
    }
}
