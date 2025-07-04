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

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).json({ message: "Tables fetched successfully", tables });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables " + error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    table.isAvailable = !table.isAvailable;
    await table.save();
    const tables = await Table.find();
    res
      .status(200)
      .json({ message: "Availability toggled successfully", tables });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error togle availability of tables " + error.message });
  }
};
