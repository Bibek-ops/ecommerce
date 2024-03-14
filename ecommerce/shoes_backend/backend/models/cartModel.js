const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity can not be less then 1."],
  },
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please enter a name of a product"],
   
  },
  image:{
    type: String,
    required: [true, "Please add the image of a product"],
  },

  stock:{
    type:Number,
    required:true,

  },

  total: {
    type: Number,
    required: true,
  },
});


module.exports = mongoose.model("item", ItemSchema);

const CartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },

    items: [ItemSchema],

    subTotal: {
      default: 0,
      type: Number,
    },
  },
  
);
module.exports = mongoose.model("cart", CartSchema);
