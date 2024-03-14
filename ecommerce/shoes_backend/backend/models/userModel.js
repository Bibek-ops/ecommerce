const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const { StringDecoder } = require("string_decoder");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requi: [true, "Please Enter your name"],
    maxLength: [35, "You cannot go futher 35 character "],
    minlength: [3, "you have minimim 3 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Enter the validate email address"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minlength: [10, "Password must be greater than 8 characters"],
    select: false,
  },
  
  image: {
   public_id:String,
   url:String
  },

  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});



// hansh the password before save to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare the password after bycrypt
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //

  return resetToken;
};

// use JWT TOKEN

module.exports = mongoose.model("userModel", userSchema);
