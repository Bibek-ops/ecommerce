const catchAsyncError = require("../middleware/catchAsyncError");
const stripe = require("stripe")(
  "sk_test_51LH2CxSE7FPWZ2J85BHiduxE4RW7A3X8xl29NcLNBh8JIPxuFu22Hs7sVa2XcHF8l6Dw2AuChHPdLkaOW83dlsIn00ahPuluMB"
);

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});