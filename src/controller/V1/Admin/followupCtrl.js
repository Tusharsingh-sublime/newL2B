const { FollowUp, Leads } = require("../../../models/schema");

module.exports = {
  add: async (req, res) => {
    try {
      const {
        lead,
        followUpType,
        followUpdate,
        followUpTime,
        feedback,
        referralName,
        referralmobile,
        referralNote,
      } = req.body;

      // Validate required fields
      if (!lead || !followUpType || !followUpdate) {
        return res.status(400).json({
          success: false,
          message: "Lead, followUpType, and followUpdate are required fields.",
        });
      }

      // Check if the lead exists before adding a follow-up
      const existingLead = await Leads.findById(lead);
      if (!existingLead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found. Please provide a valid lead ID.",
        });
      }

      // Create a new FollowUp document
      const newFollowUp = new FollowUp({
        lead,
        followUpType,
        followUpdate,
        followUpTime,
        feedback,
        referralName,
        referralmobile,
        referralNote,
      });

      // Save the FollowUp document
      //   await newFollowUp.save();
      const savedFollowUp = await newFollowUp.save();

      // Push the new follow-up's ID into the lead's followUps array
      await Leads.findByIdAndUpdate(lead, {
        $push: { followUps: savedFollowUp },
      });

      return res.status(201).json({
        success: true,
        message: "Follow-up added successfully and linked to the lead.",
        data: savedFollowUp,
      });
      //   console.log(newFollowUp);
      //   return res.status(201).json({
      //     success: true,
      //     message: "Follow-up added successfully.",
      //     data: newFollowUp,
      //   });
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
      const follow = await FollowUp.findOne({ _id }); // Use findOne instead of find
      if (!follow) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Delete the user by its ID
      await FollowUp.findByIdAndDelete(follow._id); // Use user._id from the found document

      return res.status(200).json({
        success: true,
        message: "followUp deleted successfully.",
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
    const { _id } = req.query;
    const updateData = req.body; // Fields to update

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update.",
      });
    }
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "_id is required to update a user.",
      });
    }
    try {
      const existingfollowUp = await FollowUp.findById(_id);
      if (!existingfollowUp) {
        return res.status(404).json({
          success: false,
          message: "follow Up not found.",
        });
      }
      const updatedfollow = await FollowUp.findByIdAndUpdate(_id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is applied
      });

      return res.status(200).json({
        success: true,
        message: "follow Up updated successfully.",
        data: updatedfollow,
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
