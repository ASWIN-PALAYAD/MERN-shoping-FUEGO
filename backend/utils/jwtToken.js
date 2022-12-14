//create token and saving that in cookies

const sendToken = (user,statusCode,res) => {
    const token = user.getJwtToken();

    //option for cookies

    const option = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24*60*60*1000 //+ process.env.COOKIE_EXPIRE  after date.now
        ),
        httpOnly:true
    };

    res.status(statusCode).cookie("token",token,option).json({
        success:true,
        user,
        token
    });
}

module.exports =  sendToken