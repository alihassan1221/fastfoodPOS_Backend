// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { getItemSalesSummary, getItemSalesByDate } = require("../controllers/reportController");

router.get("/item-sales-summary", getItemSalesSummary);
router.get("/item-sales-by-date", getItemSalesByDate);

module.exports = router;
