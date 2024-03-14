const ErrorHander = require("../utils/errorhander");
const catchAsynscError = require("../middleware/catchAsyncError");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const OrderHistory = require("../models/Orders");


exports.newOrder = catchAsynscError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsynscError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});
// get all order for login Users
exports.myOrders = catchAsynscError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// fetch all order value for (ADMIN)
exports.getAllOrders = catchAsynscError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });

});

// update Order Status -- Admin
exports.updateOrder = catchAsynscError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

// ceate order history ---- FFFFFFFFFFF
exports.createOrderHistory = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const orderHistory = await OrderHistory.create({
    productName: req.body.ProductName,
    productPrice: req.body.ProductPrice,
    productImage: req.body.ProductImage,
    paymentType: req.body.PaymentType,
    address: req.body.Address,
    email: req.body.Email,

  });

  res.status(201).json({
    success: true,
    orderHistory,
  });
});

// get order history according to email
exports.getOrderHistory = catchAsyncError(async (req, res, next) => {
  console.log("req.params.id");
  console.log(req.params.id);
  const orderHistory = await OrderHistory.find({ email: req.params.id });
  if (!orderHistory) {
    return next(new ErrorHander("Items Ordered not found from this id", 404));
  };
  res.status(200).json(orderHistory);
});
// ------------------------------------------------