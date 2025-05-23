const userModel = require("../../models/userModel")

async function updateUser(req, res) {
  try {
    // Make sure your auth middleware sets req.userId
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized - User not authenticated",
        error: true,
        success: false
      })
    }

    const { name, profilePic } = req.body

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters",
        error: true,
        success: false
      })
    }

    const updateData = {
      name: name.trim(),
      profilePic: profilePic || null
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,  // Use req.userId from auth middleware
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    ).select('-password -__v')

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false
      })
    }

    res.status(200).json({
      data: updatedUser,
      error: false,
      success: true,
      message: "Profile updated successfully"
    })

  } catch (err) {
    console.error("Update user error:", err)
    res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false
    })
  }
}

module.exports = updateUser