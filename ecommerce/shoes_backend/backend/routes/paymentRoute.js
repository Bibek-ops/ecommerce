const express = require("express");
const router = express.Router();
const { isAuthenticatedUser,auth } = require("../middleware/auth");

const {processPayment,sendStripeApiKey}= require("../controller/paymentController");


router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/payment/process/user").post(auth, processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;