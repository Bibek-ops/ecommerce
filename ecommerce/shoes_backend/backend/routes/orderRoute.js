const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  createOrderHistory,
  getOrderHistory,
} = require("../controller/oderController");
const router = express.Router();
const {
  isAuthenticatedUser,
  autherorizeRole,
  auth,
} = require("../middleware/auth");
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/for/user").post(auth, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, autherorizeRole("admin"),getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, autherorizeRole("admin"), updateOrder)
  .delete(isAuthenticatedUser, autherorizeRole("admin"), deleteOrder);


  
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/orders/me/user").get(auth, myOrders);

// ==========================================================------
router.route("/order/flutter/create").post(createOrderHistory);
router.route("/order/flutter/:id").get(getOrderHistory);
module.exports = router;
// ======================================-------------------------


