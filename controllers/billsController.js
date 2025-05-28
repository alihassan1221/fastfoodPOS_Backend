const billsModel = require("../models/billsModel");

//add items
const addBillsController = async (req, res) => {
  try {
    const newBill = new billsModel(req.body);
    await newBill.save();
    res.send("Bill Created Successfully!");
  } catch (error) {
    res.send("something went wrong");
    console.log(error);
  }
};

//get blls data
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find({ isDeleted: { $ne: true } }); // exclude deleted bills
    res.send(bills);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
};

const deleteBillController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBill = await billsModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedBill) {
      return res.status(404).send({ message: "Bill not found" });
    }

    res.send({ message: "Bill deleted successfully", bill: deletedBill });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
};



module.exports = {
  addBillsController,
  getBillsController,
  deleteBillController,
};
