const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../../models/schema"); // Import the corrected Mongoose model

module.exports = {
  // Add User (Admin or User)
  addUser: async (req, res) => {
    const { username, email, password, role } = req.body;

    console.log("Request received to add user:", { username, email, role });

    if (!username || !email || !password || !role) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (!["admin", "user"].includes(role)) {
      console.log("Validation failed: Invalid role", role);
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 'admin' or 'user'.",
      });
    }

    try {
      console.log("Checking if email already exists:", email);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Email already exists:", email);
        return res.status(409).json({ success: false, message: "Email already exists." });
      }

      console.log("Hashing the password for:", username);
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("Creating new user in the database...");
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();
      console.log(`User with role '${role}' added successfully:`, username);

      return res.status(201).json({
        success: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully.`,
      });
    } catch (error) {
      console.error("Error occurred while adding user:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  // Login Controller
  loginController: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    try {
      console.log("Finding user by email:", email);
      const user = await User.findOne({ email, isActive: true });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid password." });
      }

      // Generate JWT Token
      console.log("Generating JWT token for user:", user.username);
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret", // Replace "secret" with a secure environment variable in production
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error occurred during login:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
};
