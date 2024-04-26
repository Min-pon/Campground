const User = require("../models/User");

//Get token from model, create cookie & send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//@desc Register user
//@route POST api/v1/auth/register
//@access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, telephone, password, role } = req.body;
    //create user
    console.log(name, email);
    const user = await User.create({
      name,
      email,
      telephone,
      password,
      role,
    });
    //create token
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc Login user
//@route POST api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide an email and password",
      });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

//@desc Get current Logged in user
//@route POST /api/v1/auth/info
//@access Private
exports.getInfo = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

//@desc Update user information
//@route PUT /api/v1/auth/info
//@access Private
exports.editInfo = async (req, res, next) => {
    try {
        //Create new information
        req.user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidatiors: true
        });
        res.status(200).json({
            success:true,
            data: req.user
        });
    }catch (err){
        res.status(400).json({success: false})
    }
}

//@desc Log user out / clear cookie
//@route GET api/v1/auth/logout
//@access Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

//@desc delete account
//@route DELETE api/v1/auth/delete
//@access Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await User.findById(req.user.id);
    if(!account){
      return res.status(400).json({success: false});
    }
    await account.deleteOne();
    res.status(200).json({
      success:true,
      data: {}
    });

  }catch (err){
    res.status(400).json({success: false});
  }
}