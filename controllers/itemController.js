const itemModel = require("../models/itemModel");

// get items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// add items
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.status(201).send("Item Created Successfully!");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message || "Failed to create item" });
  }
};

// update item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    const updatedItem = await itemModel.findOneAndUpdate(
      { _id: itemId },
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json("Item Updated");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message || "Failed to update item" });
  }
};

// delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    const deletedItem = await itemModel.findOneAndDelete({ _id: itemId });
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json("Item Deleted");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message || "Failed to delete item" });
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
