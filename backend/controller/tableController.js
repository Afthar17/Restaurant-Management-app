import Table from "../models/tableModel.js";

export const addTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    if (!tableNumber || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: "Table already exists" });
    }
    const newTable = new Table({
      tableNumber,
      capacity,
    });
    await newTable.save({ new: true });
    const tables = await Table.find();
    res.status(200).json({ message: "Table added successfully", tables });
  } catch (error) {
    res.status(500).json({ message: "Error adding table " + error.message });
  }
};
