const User = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const { json } = require('body-parser');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');

//Register user
exports.createUser = catchAsyncErrors(async(req,res,next) =>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'http://test.com',
            url:'http://test.com'
        }
    })

    sendToken(user,201,res)

});

//login User
exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password ){
        return next(new ErrorHandler("Please enter your  email & password"));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("User is not  found with this email & password",401));
    }

    const isPasswordMatched = await user.comparePassword(password); 

    if(!isPasswordMatched){
        return next(new ErrorHandler("you are entered a wrong password",401));
    }

    sendToken(user,200,res)

   
});

//logout user
exports.logoutUser = catchAsyncErrors(async (req,res,next) =>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:'Logout successfully',

    });
});

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found with this email",404));
    }

    //get ResetPassoword Token 

    const resetToken = user.getResetToken();

    await user.save({
        validateBeforeSave:false
    });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

    try {

        await sendMail({
            email:user.email,
            subject : `Ecommerce Password Recovery`,
            message,
        })

        res.status(200).json({
            success: true,
            message:`Email set to ${user.email} successfully`
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;

        await user.save({
            validateBeforeSave:false,
        });

        return next(new ErrorHandler(error.message))
    }
})




//Reset Password
exports.resetPassword = catchAsyncErrors(async (req,res,next) => {
    
    //create a token hash

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordTime:{$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset password url is invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("new password and confirm password must be same",400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();

    sendToken(user,200,res);

})


//Get user details
exports.userDetails = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});

//update user password
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {
    
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    
    if(!isPasswordMatched){
        return next(
            new ErrorHandler("Old password is incorrect",400)
        );
    };

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(
            new ErrorHandler("new password and confirm password should be same",400)
        );
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);

})

//update user profile
exports.updateProfile = catchAsyncErrors(async (req,res,next) =>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    };

    //we add cloudinary letter then awe are giving condition for the avatar

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    })
});


//get all users --admin
exports.getAllUsers = catchAsyncErrors(async (req,res,next) =>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})

//Get single user details --admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User is not found with this id",400));
    }

    res.status(200).json({
        success:true,
        user,
    })
})

//change user role --admin
exports.updateUserRole = catchAsyncErrors(async (req,res,next) =>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify : false,
    });

    res.status(200).json({
        success:true,
        user,
    })
});

//Delete user --admin
exports.deleteUser = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not foun with this id",400));
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message: "User deleted successfully"
    });
});
