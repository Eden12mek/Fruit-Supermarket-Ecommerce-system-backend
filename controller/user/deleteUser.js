const userModel = require("../../models/userModel")
const deleteUserPermission = require("../../helpers/permission")

async function deleteUser(req, res) {
    try {
        const sessionUserId = req.userId
        const { _id } = req.body // Changed from userId to _id to match frontend

        // Check permission
        if (!deleteUserPermission(sessionUserId)) {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false
            })
        }

        // Validate user ID
        if (!_id) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false
            })
        }

        // Find and delete the user
        const deletedUser = await userModel.findByIdAndDelete(_id)

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        res.status(200).json({
            message: "User deleted successfully",
            error: false,
            success: true,
            data: deletedUser
        })

    } catch (err) {
        console.error("Delete user error:", err)
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        })
    }
}   

module.exports = deleteUser