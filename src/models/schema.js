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
    type: String, // Keeping adminId as String
    ref: "Admin",
    required: true,
  }, // One-to-many relationship
  username: { type: String, required: true, unique: true }, // Unique username
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

// Lead Schema
const LeadSchema = new mongoose.Schema({
  username: { type: String, required: true, ref: "User" }, // Referencing User by username
  fullName: { type: String, required: true },
  leadsType: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  companyName: { type: String },
  companyAddress: { type: String },
  followUps: [{ type: mongoose.Schema.Types.Array, ref: "FollowUp" }],
  createdAt: { type: Date, default: Date.now }, // One-to-Many Relationship with FollowUps
});

// Follow Up Schema
const FollowUpSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Leads", required: true }, // Reference to Leads
  followUpType: { type: String, required: true },
  followUpdate: { type: Date, required: true },
  followUpTime: { type: String }, // Use String or Date instead of Timestamp (Mongoose doesn’t have "Timestamp")
  feedback: { type: String },
  referralName: { type: String },
  referralmobile: { type: String },
  referralNote: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Admin: mongoose.model("Admin", AdminSchema),
  User: mongoose.model("User", UserSchema),
  Leads: mongoose.model("leads", LeadSchema),
  FollowUp: mongoose.model("followUp", FollowUpSchema),
};
