import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tableNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        "10:00am-12:00pm",
        "12:00pm-2:00pm",
        "2:00pm-4:00pm",
        "4:00pm-6:00pm",
        "6:00pm-8:00pm",
        "8:00pm-10:00pm",
      ],
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ cancelBooking: 1 }, { expireAfterSeconds: 60 });
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
