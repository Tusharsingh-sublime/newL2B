const mongoose = require("mongoose");

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin", required: true },
  isActive: { type: Boolean, default: true },
  firebase_token: { type: String }, // Used for push notifications
  createdAt: { type: Date, default: Date.now },
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  role: { type: String, enum: ["user"], default: "user", required: true },
  Roles: { type: String, require: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the models
module.exports = {
  Admin: mongoose.model("Admin", AdminSchema),
  User: mongoose.model("User", UserSchema),
};
