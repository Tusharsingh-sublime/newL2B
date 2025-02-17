const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Admin, User } = require("../../../models/schema");
module.exports = {
  // Add User (Admin or User)
  addUser: async (req, res) => {
    const { username, email, password, role, adminId } = req.body;

    console.log("Request received to add user:", {
      username,
      email,
      role,
      adminId,
    });

    if (!username || !email || !password || !role || !adminId) {
      //   console.log("Validation failed: Missing fields");
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!["admin", "user"].includes(role)) {
      // console.log("Validation failed: Invalid role", role);
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 'admin' or 'user'.",
      });
    }

    try {
      //   console.log("Checking if email already exists:", email);
      const existingAdmin = await Admin.findOne({ email });
      const existingUser = await User.findOne({ email });
      if (existingUser || existingAdmin) {
        // console.log("Email already exists:", email);
        return res
          .status(409)
          .json({ success: false, message: "Email already exists." });
      }

      //   console.log("Hashing the password for:", username);
      const hashedPassword = await bcrypt.hash(password, 10);

      //   console.log("Creating new user in the database...");
      const newUser = new Admin({
        username,
        email,
        password: hashedPassword,
        role,
        adminId,
      });

      await newUser.save();
      //   console.log(`User with role '${role}' added successfully:`, username);

      return res.status(201).json({
        success: true,
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } added successfully.`,
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

  loginController: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    try {
      console.log("Checking for admin by email:", email);

      // Step 1: Check if the email exists in the Admin schema
      let user = await Admin.findOne({ email, isActive: true });

      if (user) {
        console.log("Admin found. Validating password...");

        // Step 2: Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: "Invalid password for admin.",
          });
        }

        // Step 3: Generate a JWT token for admin
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
            userType: "admin",
          },
          process.env.JWT_SECRET || "secret",
          { expiresIn: "2h" }
        );

        user.password = undefined; // Remove password before sending the response

        return res.status(200).json({
          success: true,
          message: "Admin login successful.",
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            userType: "admin",
          },
        });
      }

      // Step 2: If not found in Admin schema, check in the User schema
      console.log("Admin not found. Checking for user by email...");
      user = await User.findOne({ email, isActive: true });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      console.log("User found. Validating password...");

      // Step 3: Validate the password for user
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password for user.",
        });
      }

      // Step 4: Generate a JWT token for user
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, userType: "user" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "2h" }
      );

      user.password = undefined; // Remove password before sending the response

      return res.status(200).json({
        success: true,
        message: "User login successful.",
        token,
        user: {
          id: user._id,
          username: user.fullName,
          email: user.email,
          role: user.role,
          userType: "user",
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
