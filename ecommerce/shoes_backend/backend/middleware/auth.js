const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");




exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHander("Please login to access the data", 400));
  }
  const decodedatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await userModel.findById(decodedatedData.id);
  next();

});



exports.auth = async (req, res, next) => {
  // check header
  console.log("---------------------------------------------------");
  
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
  
    return next(new ErrorHander("Please login to access the data", 400));
  }
  const token = authHeader.split(" ")[1];
  try {
     const decodedatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

     req.user = await userModel.findById(decodedatedData.id);
     next();
   
  } catch (error) {
    console.log(error);
    throw next(new ErrorHander("Please login to access the data", 400));
  }
  
};



exports.autherorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role:${req.user.role} is not allowed this resource`,
          403
        )
      );
    }
    next();
  };
};
