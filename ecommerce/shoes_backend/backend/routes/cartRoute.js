const express = require("express");
const router = express.Router();

const { addItemToCart, deleteCartItems, getCartsItems } = require("../controller/cartController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/create/cart").post(isAuthenticatedUser,addItemToCart);
router.route("/delete/cart").delete(isAuthenticatedUser,deleteCartItems);
router.route("/get/cart").get(isAuthenticatedUser,getCartsItems);



module.exports = router;

