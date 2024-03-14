const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectID,
      required: true,
      ref: "userModel",
    },
    items: [
      {
        itemId: {
          type: ObjectID,
          ref: "Product",
          required: true,
        },
        name: String,
        image: {
          type: String,
          required: [true, "Please add the image of a product"],
        },
        stock: {
          type: Number,
          required: [true, "Please add some stoke for your product"],
          maxLength: [3, "Stock can not exceed than 3 characters"],
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
