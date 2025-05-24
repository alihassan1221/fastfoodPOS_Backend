const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
require("colors");

const connectDb = require("../config/config"); // updated path
const itemRoutes = require("../routes/itemRoutes");
const userRoutes = require("../routes/userRoutes");
const billRoutes = require("../routes/billsRoute");

// Load environment variables
dotenv.config();

// DB connect
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);

// ✅ Vercel requires default export as function
module.exports = serverless(app); // ✅ NO .handler
