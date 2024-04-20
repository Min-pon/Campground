const User = require("../models/User");

//Get token from model, create cookie & send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };
    if(process.env.NODE_ENV==='production'){
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
};

//@desc Register User
//@route POST ??/auth/register
//@access Public
exports.register = async (req, res, next) => {
    try {
        const {name, email, telephone, password, role} = req.body;
        //create user
        const user = await User.create({
            name,
            email,
            telephone,
            password,
            role
        });
        //create token
        sendTokenResponse(user, 200, res);
    }catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
};

//@desc 