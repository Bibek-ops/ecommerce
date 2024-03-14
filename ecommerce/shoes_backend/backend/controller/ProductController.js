// const { findByIdAndUpdate } = require("../models/ProductModel");
const Product = require("../models/ProductModel");
const ErrorHander = require("../utils/errorhander");
const catchAsynscError = require("../middleware/catchAsyncError");
const Apifeatures = require("../utils/apifeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require("cloudinary");
// creating the product done
exports.createProduct = catchAsynscError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// get product details
exports.getProductDetails = catchAsynscError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("product cannot find", 400));
    // return res.status(500).json({
    //   success: false,
    //   message: "Product cannot find",
    // });
  }

  res.status(200).json({
    success: true,
    product,
    message: "product details successfully",
  });
});

// get all the product
exports.getAllProducts = catchAsynscError(async (req, res, next) => {
  // return next(new ErrorHander("product cannot find", 404));
  // calling the Api features  class to get value

  const resultPerPage = 10;

  const productNumber = await Product.countDocuments();

  const apifeatures = new Apifeatures(Product.find(), req.query)
    .search()
    .filter();

  // let products = await apifeatures.query;
  let data = await apifeatures.query;

  let filteredProductsCount = data.length;

  apifeatures.pagination(resultPerPage);

  data = await apifeatures.query.clone();
  res.status(200).json({
    sccess: true,
    data,
    productNumber,
    resultPerPage,
    filteredProductsCount,
  });
});
// find all product (admin)
exports.findAllProducts = catchAsynscError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// make get all product function

// update the product done

exports.updateProduct = catchAsynscError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("product cannot find", 400));
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
    message: "product updated successfully",
  });
});

exports.deleteProduct = catchAsynscError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("product cannot find to delete", 400));
  }
  // delete images from cloudninary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();
  res.status(200).json({
    success: true,
    product,
    message: "product deleted successfully",
  });
});

exports.createProductReview = catchAsynscError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);

    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all the value of reviews
exports.getProductsReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHander("product cannot find", 400));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete the review of product
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHander("product cannot find", 400));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() != req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
// get all product with low price
exports.getLowPrice = catchAsyncError(async (req, res, next) => {
  const product = await Product.find({});
  if (!product) {
    return next(new ErrorHander("product cannot find", 400));
  }
  console.log(product.length);
  // filter product which price is low than 2000
  const data = product.filter((pro) => pro.price < 2000);

  res.status(200).json({
    success: true,
    data,
  });
});

// make recent arrivals products
exports.gethighratedProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.find({});
  if (!product) {
    return next(new ErrorHander("product cannot find", 400));
  }
  // filter product which is has high ratings
  const data = product.filter((pro) => pro.ratings > 3);

  res.status(200).json({
    success: true,
    data,
  });
});
