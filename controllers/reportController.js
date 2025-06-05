// controllers/reportController.js
const Bill = require("../models/billsModel");
const moment = require("moment-timezone");

const getItemSalesSummary = async (req, res) => {
    try {
        const bills = await Bill.find();
        const summary = {};

        const now = moment().tz("Asia/Karachi");

        const getRange = (label) => {
            switch (label) {
                case 'today':
                    return [now.clone().startOf("day"), now.clone().endOf("day")];
                case 'yesterday':
                    return [
                        now.clone().subtract(1, "day").startOf("day"),
                        now.clone().subtract(1, "day").endOf("day"),
                    ];
                case 'thisWeek':
                    return [
                        now.clone().startOf("isoWeek"),
                        now.clone().endOf("isoWeek"),
                    ];
                case 'lastWeek':
                    return [
                        now.clone().subtract(1, "week").startOf("isoWeek"),
                        now.clone().subtract(1, "week").endOf("isoWeek"),
                    ];
                case 'thisMonth':
                    return [now.clone().startOf("month"), now.clone().endOf("month")];
                case 'lastMonth':
                    return [
                        now.clone().subtract(1, "month").startOf("month"),
                        now.clone().subtract(1, "month").endOf("month"),
                    ];
                default:
                    return [null, null];
            }
        };

        const periods = ["today", "yesterday", "thisWeek", "lastWeek", "thisMonth", "lastMonth"];

        for (const bill of bills) {
            const billDate = moment(bill.date).tz("Asia/Karachi");

            for (const item of bill.cartItems) {
                const name = item.name;

                if (!summary[name]) {
                    summary[name] = {
                        today: 0,
                        yesterday: 0,
                        thisWeek: 0,
                        lastWeek: 0,
                        thisMonth: 0,
                        lastMonth: 0,
                        total: 0,
                    };
                }

                for (const period of periods) {
                    const [start, end] = getRange(period);
                    if (billDate.isBetween(start, end, undefined, "[]")) {
                        summary[name][period] += item.quantity;
                    }
                }

                summary[name].total += item.quantity;
            }
        }

        const result = Object.entries(summary).map(([name, data]) => ({ name, ...data }));
        res.status(200).json(result);
    } catch (error) {
        console.error("Sales summary error:", error);
        res.status(500).send("Server error");
    }
};

const getItemSalesByDate = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Missing start or end date" });
    }

    const startDate = moment.tz(start, "Asia/Karachi").startOf("day").toDate();
    const endDate = moment.tz(end, "Asia/Karachi").endOf("day").toDate();

    // Fetch bills in the date range
    const bills = await Bill.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Prepare detailed records: array of { item, date, quantity }
    // We'll flatten all cartItems with the bill date
    let detailedRecords = [];

    bills.forEach((bill) => {
      // bill.date is a Date object, normalize to 'YYYY-MM-DD' string
      const billDate = moment(bill.date).tz("Asia/Karachi").format("YYYY-MM-DD");

      bill.cartItems.forEach((item) => {
        detailedRecords.push({
          item: item.name,
          date: billDate,
          quantity: item.quantity,
        });
      });
    });

    // Optionally, you can group by item+date and sum quantities if multiple bills have same item on same date
    // But usually each bill is unique, so maybe no need.

    res.status(200).json(detailedRecords);
  } catch (error) {
    console.error("Error in getItemSalesDetailedByDate:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
    getItemSalesSummary,
    getItemSalesByDate,
};
