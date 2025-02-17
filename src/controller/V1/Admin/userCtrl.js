const { User, Admin } = require("../../../models/schema");
const bcrypt = require("bcrypt");

module.exports = {
  // Add User
  addUser: async (req, res) => {
    const {
      adminId, // Required to associate user with an admin
      username,
      fullName,
      password,
      mobile,
      email,
      branch,
      gender,
      targetNo,
      startDate,
      dueDate,
    } = req.body;

    // Validate required fields
    if (
      !adminId ||
      !username ||
      !fullName ||
      !password ||
      !mobile ||
      !email ||
      !branch ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    try {
      // Ensure the given `adminId` exists
      const adminExists = await Admin.findOne({ adminId });
      if (!adminExists) {
        return res.status(404).json({
          success: false,
          message: "Admin not found.",
        });
      }

      // Check if user already exists by email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        adminId,
        username,
        fullName,
        password: hashedPassword,
        mobile,
        email,
        branch,
        role: "user", // Ensuring role is set correctly
        gender,
        isActive: true, // Default value
        assignedDate: new Date(), // Optional: Set current date if needed
        targetNo,
        startDate,
        dueDate,
      });

      // Save user to database
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User added successfully.",
        user: {
          id: newUser._id,
          username: newUser.username,
          fullName: newUser.fullName,
          email: newUser.email,
          adminId: newUser.adminId,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  // Update User
  updateUser: async (req, res) => {
    const { adminId, email } = req.body; // Expecting email from the request parameters
    const updateFields = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "adminId is required to update a user.",
      });
    }
    try {
      const user = await User.findOne({ email, adminId }); // Find user by email
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // If password is being updated, hash it
      if (updateFields.password) {
        updateFields.password = await bcrypt.hash(updateFields.password, 10);
      }

      // Merge updateFields into the user object
      Object.assign(user, updateFields);
      await user.save(); // Save updated user document

      return res.status(200).json({
        success: true,
        message: "User updated successfully.",
        user,
      });
    } catch (error) {
      console.error("Error occurred while updating user:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  // Delete User
  deleteUser: async (req, res) => {
    const { adminId, email } = req.query;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "adminId is required to update a user.",
      });
    }
    try {
      // Find the user by email
      const user = await User.findOne({ email, adminId }); // Use findOne instead of find
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Delete the user by its ID
      await User.findByIdAndDelete(user._id); // Use user._id from the found document

      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Error occurred while deleting user:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  // List All Users
  listUsers: async (req, res) => {
    try {
      let matchData = { isActive: true }; // Initial filter to get only active users
      const adminId = req.query.adminId; // If using JWT, get adminId from req.user.adminId
      if (!adminId) {
        return res.status(400).json({
          success: false,
          message: "adminId is required to fetch users.",
        });
      }
      matchData.adminId = adminId;
      // Apply optional filters based on query parameters
      if (req.query.username) {
        matchData.username = { $regex: req.query.username, $options: "i" }; // Case-insensitive partial match
      }

      if (req.query.fullName) {
        matchData.fullName = { $regex: req.query.fullName, $options: "i" };
      }

      if (req.query.email) {
        matchData.email = { $regex: req.query.email, $options: "i" };
      }

      if (req.query.mobile) {
        matchData.mobile = { $regex: req.query.mobile, $options: "i" };
      }

      if (req.query.gender) {
        const validGenders = ["male", "female", "other"];
        if (validGenders.includes(req.query.gender.toLowerCase())) {
          matchData.gender = req.query.gender.toLowerCase();
        }
      }

      if (req.query.branch) {
        matchData.branch = { $regex: req.query.branch, $options: "i" };
      }

      if (req.query.Roles) {
        matchData.Roles = { $regex: req.query.Roles, $options: "i" };
      }

      // Filter by date range (createdAt)
      if (req.query.startDate || req.query.endDate) {
        matchData.createdAt = {};
        if (req.query.startDate) {
          matchData.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
          matchData.createdAt.$lte = new Date(req.query.endDate);
        }
      }

      let pageNo = 0;
      let limit = 10;

      // Validate and apply pagination
      if (req.query.pageNo !== undefined) {
        if (
          !Number.isInteger(Number(req.query.pageNo)) ||
          Number(req.query.pageNo) < 0
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid pageNo passed" });
        } else {
          pageNo = Number(req.query.pageNo);
        }
      }

      if (req.query.limit !== undefined) {
        if (
          !Number.isInteger(Number(req.query.limit)) ||
          Number(req.query.limit) < 0
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid limit passed" });
        } else {
          limit = Number(req.query.limit);
        }
      }

      // Perform the query with filtering, pagination, and excluding the password field
      const users = await User.find(matchData)
        .select("-password") // Exclude password from the response
        .skip(pageNo * limit)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by created date (most recent first)

      const totalRecords = await User.countDocuments(matchData);

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
        totalRecords,
      });
    } catch (error) {
      console.error("Error occurred while listing users:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
  listTargets: async (req, res) => {
    try {
      const { fromDate, toDate, branch } = req.query; // Get fromDate, toDate, and branch from query params
      const currentDate = new Date();
      let query = {}; // Initialize the query object

      // If fromDate and toDate are provided, add a filter for createdAt
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Validate the date formats
        if (isNaN(from) || isNaN(to)) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid date format. Please provide valid fromDate and toDate in YYYY-MM-DD format.",
          });
        }

        to.setHours(23, 59, 59, 999);

        // Add the createdAt filter to the query
        query.createdAt = { $gte: from, $lte: to };
      }

      if (branch) {
        query.branch = branch;
      }

      const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });

      // Add RemainsDays for each user
      const usersWithRemainsDays = users.map((user) => {
        let remainsDays = null;
        if (user.dueDate) {
          remainsDays = Math.ceil(
            (user.dueDate - currentDate) / (1000 * 60 * 60 * 24)
          );
        }
        return {
          ...user.toObject(),
          RemainsDays: remainsDays,
        };
      });

      // Respond with the filtered or full data
      return res.status(200).json({
        success: true,
        message:
          fromDate && toDate && branch
            ? "Filtered users fetched successfully (by date and branch)"
            : fromDate && toDate
            ? "Filtered users fetched successfully (by date)"
            : branch
            ? "Filtered users fetched successfully (by branch)"
            : "All users fetched successfully",
        data: usersWithRemainsDays,
      });
    } catch (error) {
      console.error("Error occurred while fetching users:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
  listTragetsDateWise: async (req, res) => {
    try {
      const { fromDate, toDate } = req.query; // Get fromDate and toDate from query params

      if (!fromDate || !toDate) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide both fromDate and toDate in the query parameters.",
        });
      }

      const from = new Date(fromDate);
      const to = new Date(toDate);

      // Validate the date formats
      if (isNaN(from) || isNaN(to)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid date format. Please provide valid fromDate and toDate in YYYY-MM-DD format.",
        });
      }

      // Ensure 'to' date includes the entire day
      to.setHours(23, 59, 59, 999);

      // Fetch users within the specified date range
      const users = await User.find({
        createdAt: { $gte: from, $lte: to },
      })
        .select("-password")
        .sort({ createdAt: -1 });

      const currentDate = new Date();

      // Add RemainsDays for each user
      const usersWithRemainsDays = users.map((user) => {
        let remainsDays = null;
        if (user.dueDate) {
          remainsDays = Math.ceil(
            (user.dueDate - currentDate) / (1000 * 60 * 60 * 24)
          );
        }
        return {
          ...user.toObject(),
          RemainsDays: remainsDays,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Filtered users fetched successfully",
        data: usersWithRemainsDays,
      });
    } catch (error) {
      console.error("Error occurred while fetching users:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
};
