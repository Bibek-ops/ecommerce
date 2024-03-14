const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors());
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileupload = require("express-fileupload");

const morgan = require("morgan");

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(morgan());

const errorMiddleware = require("./middleware/error");

// import routes
const product = require("./routes/ProductRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const cart = require("./routes/cartRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v2", product);
app.use("/api/v2", user);
app.use("/api/v2", order);
app.use("/api/v2", cart);
app.use("/api/v2", payment);

// Middleware for error handler
app.use(errorMiddleware);

module.exports = app;
