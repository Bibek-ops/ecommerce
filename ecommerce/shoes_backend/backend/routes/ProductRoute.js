const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductsReviews,
  deleteReviews,
  findAllProducts,
  getLowPrice,
} = require("../controller/ProductController");

const {
  isAuthenticatedUser,
  autherorizeRole,
  auth,
} = require("../middleware/auth");
const router = express.Router();

router
  .route("/product/new")
  .post(isAuthenticatedUser, autherorizeRole("admin"), createProduct);

router.route("/product").get(getAllProducts);
router.route("/getall/lowprice/product").get(getLowPrice);

// get all product (ADMIN)
router.route("/getall/product").get(isAuthenticatedUser, findAllProducts, autherorizeRole("admin"));

//for admin routes in product crud form
router
  .route("/products/:id")
  .put(isAuthenticatedUser, autherorizeRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, autherorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/product/review").put(isAuthenticatedUser, createProductReview);
// give review using authorization header method
router.route("/give/product/review").put(auth, createProductReview);
router
  .route("/reviews/")
  .get(getProductsReviews)
  .delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
