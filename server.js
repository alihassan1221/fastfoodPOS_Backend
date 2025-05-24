// const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotanv = require("dotenv");
// const { bgCyan } = require("colors");
// require("colors");
// const connectDb = require("./config/config");
// //dotenv config
// dotanv.config();
// //db config
// connectDb();
// //rest object
// const app = express();

// //middlwares
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(morgan("dev"));

// //routes
// app.use("/api/items", require("./routes/itemRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/bills", require("./routes/billsRoute"));

// //port
// const PORT = process.env.PORT || 8080;

// //listen
// app.listen(PORT, () => {
//   console.log(`Server Running On Port ${PORT}`.bgCyan.white);
// });

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { bgCyan } = require("colors");
const serverless = require("serverless-http");
require("colors");
const connectDb = require("./config/config");

// dotenv config
dotenv.config();

// db config
connectDb();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billsRoute"));

// ❌ REMOVE THIS WHEN USING serverless-http
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server Running On Port ${PORT}`.bgCyan.white);
// });

// ✅ This is the correct export
module.exports.handler = serverless(app);
