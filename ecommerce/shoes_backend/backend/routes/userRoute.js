const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  singleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const {
  isAuthenticatedUser,
  autherorizeRole,
  auth,
} = require("../middleware/auth");
const router = express.Router();

router.route("/register/user").post(registerUser);

router.route("/user/login").post(loginUser);

router.route("/reset/password").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/get/user/details").get(auth, getUserDetails);
// route for Profile
router.route("/user/details").get(isAuthenticatedUser, getUserDetails);

router.route("/user/change/password").put(isAuthenticatedUser, updatePassword);
router.route("/change/password").put(auth, updatePassword);

router.route("/user/logout").get(logout);
router
  .route("/admin/user")
  .get(isAuthenticatedUser, autherorizeRole("admin"), getAllUser);

router
  .route("/admin/getall/user")
  .get(auth, autherorizeRole("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, autherorizeRole("admin"), singleUser)
  .put(isAuthenticatedUser, autherorizeRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, autherorizeRole("admin"), deleteUser);

// use
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/user/update/profile").put(auth, updateProfile);

module.exports = router;
