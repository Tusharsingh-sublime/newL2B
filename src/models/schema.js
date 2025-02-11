const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true }, // Role can be "admin" or "user"
  isActive: { type: Boolean, default: true },
  subscriptionStatus: { type: String, default: "Inactive" }, // Applicable for "user"
  firebase_token: { type: String },
});

// Export Mongoose model (not just the schema)
module.exports = mongoose.model("User", UserSchema);
