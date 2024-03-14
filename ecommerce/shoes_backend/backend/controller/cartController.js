const Item = require("../models/ProductModel");
const Cart = require("../models/cartApiModel");
const catchAsynscError = require("../middleware/catchAsyncError");

exports.addItemToCart = catchAsynscError(async (req, res, next) => {
  const userId = req.user._id;
  const { itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    const item = await Item.findOne({ _id: itemId });

    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    const price = item.price;
    const name = item.name;
    const image = item.images[0].url;
    const stock = item.Stock;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;

        cart.total = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.items[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ itemId, name, quantity, stock, price, image });
        cart.total = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        userId,
        items: [{ itemId, name, quantity, stock, image, price }],
        total: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

exports.deleteCartItems = catchAsynscError(async (req, res, next) => {
  const owner = req.user._id;
  const itemId = req.query.itemId;
  console.log(itemId);
  console.log(owner);
  try {
    let cart = await Cart.findOne({ owner });

    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.total -= item.quantity * item.price;
      if (cart.total < 0) {
        cart.total = 0;
      }
      cart.items.splice(itemIndex, 1);
      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();

      res.status(200).send(cart);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

exports.getCartsItems = catchAsynscError(async (req, res, next) => {
  const owner = req.user._id;

  try {
    const cart = await Cart.findOne({ owner });
    if (cart && cart.items.length > 0) {
      res.status(200).send(cart.items);
    } else {
      res.send(null);
    }
  } catch (error) {
    res.status(500).send();
  }
});
