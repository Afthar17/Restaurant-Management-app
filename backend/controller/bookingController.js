import Booking from "../models/bookingModel.js";
import Table from "../models/tableModel.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res
      .status(200)
      .json({ message: "Bookings fetched successfully", bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings " + error.message });
  }
};

export const addBooking = async (req, res) => {
  try {
    const user = req.user;
    const { tableNumber, timeSlot, date, numberOfGuests, specialRequests } =
      req.body;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!tableNumber || !timeSlot || !numberOfGuests || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const existingBooking = await Booking.findOne({
      tableNumber,
      date: bookingDate,
      timeSlot,
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Table is already booked" });
    }
    const table = await Table.findById(tableNumber);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    const newBooking = new Booking({
      userId: user._id,
      tableNumber,
      date: bookingDate,
      timeSlot,
      numberOfGuests,
      specialRequests,
    });
    await newBooking.save({ new: true });
    res
      .status(200)
      .json({ message: "Booking added successfully", id: newBooking._id });
  } catch (error) {
    res.status(500).json({ message: "Error adding booking " + error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const table = await Table.findById(booking.tableNumber);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save({ new: true });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting booking " + error.message });
  }
};
