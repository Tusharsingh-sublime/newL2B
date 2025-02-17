const mongoose = require("mongoose");

// Admin Schema (Updated with adminId)
const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true }, // Unique ID for Admin
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin", required: true },
  isActive: { type: Boolean, default: true },
  firebase_token: { type: String }, // Used for push notifications
  createdAt: { type: Date, default: Date.now },
});

// User Schema (Each user belongs to an Admin using adminId)
const UserSchema = new mongoose.Schema({
  adminId: {
    type: String, // Changed from ObjectId to String to match Admin's adminId
    ref: "Admin",
    required: true,
  }, // One-to-many relationship
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  role: { type: String, enum: ["user"], default: "user", required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  assignedDate: { type: Date },
  targetNo: { type: Number },
  startDate: { type: Date },
  dueDate: { type: Date },
});

module.exports = {
  Admin: mongoose.model("Admin", AdminSchema),
  User: mongoose.model("User", UserSchema),
};
