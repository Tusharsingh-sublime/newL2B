const { Leads } = require("../../../models/schema");

module.exports = {
  add: async (req, res) => {
    const {
      username,
      fullName,
      leadsType,
      mobile,
      email,
      address,
      companyName,
      companyAddress,
    } = req.body;
    if (!username || !fullName || !leadsType || !mobile || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    try {
      const newLeads = new Leads({
        username,
        fullName,
        leadsType,
        mobile,
        email,
        address,
        companyName,
        companyAddress,
      });
      await newLeads.save();
      return res.status(201).json({
        success: true,
        message: "User added successfully.",
        data: {
          username: newLeads.username,
          fullName: newLeads.fullName,
          leadsType: newLeads.leadsType,
          mobile: newLeads.mobile,
          email: newLeads.email,
          address: newLeads.address,
          companyName: newLeads.companyName,
          companyAddress: newLeads.companyAddress,
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
  update: async (req, res) => {
    const { _id } = req.query; // Get lead ID from URL
    const updateData = req.body; // Fields to update

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update.",
      });
    }

    try {
      // Check if lead exists
      const existingLead = await Leads.findById(_id);
      if (!existingLead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found.",
        });
      }

      // Update lead
      const updatedLead = await Leads.findByIdAndUpdate(_id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is applied
      });

      return res.status(200).json({
        success: true,
        message: "follow up updated successfully.",
        data: updatedLead,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
  delete: async (req, res) => {
    const { _id } = req.query;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "_id is required to update a user.",
      });
    }
    try {
      const Lead = await Leads.findOne({ _id }); // Use findOne instead of find
      if (!Lead) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Delete the user by its ID
      await Leads.findByIdAndDelete(Lead._id); // Use user._id from the found document

      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
  listLeads: async (req, res) => {
    try {
      // Extract query parameters for filtering, sorting, and pagination
      const {
        username,
        leadsType,
        companyName,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
      } = req.query;

      // Build the filter object dynamically based on query parameters
      let filter = {};
      if (username) filter.username = username;
      if (leadsType) filter.leadsType = leadsType;
      if (companyName) filter.companyName = companyName;

      // Define sorting order
      const sortOrder = order === "asc" ? 1 : -1;

      // Pagination
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
      const skip = (pageNumber - 1) * pageSize;

      // Fetch leads from the database with filtering, sorting, and pagination
      const leads = await Leads.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .exec();

      // Count total leads for pagination metadata
      const totalLeads = await Leads.countDocuments(filter);

      return res.status(200).json({
        success: true,
        message: "Leads retrieved successfully.",
        totalLeads,
        totalPages: Math.ceil(totalLeads / pageSize),
        currentPage: pageNumber,
        pageSize,
        data: leads,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
};
