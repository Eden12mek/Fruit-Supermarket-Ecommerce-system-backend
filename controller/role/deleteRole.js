const Role = require('../../models/roleModel');
const rolePermission = require('../../helpers/permission');

async function deleteRoleController(req, res) {
    try {
        const sessionUserId = req.userId;
        const { roleId } = req.body;

        if (!rolePermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        if (!roleId) {
            throw new Error("Role ID is required");
        }

        const deletedRole = await Role.findByIdAndDelete(roleId);

        if (!deletedRole) {
            throw new Error("Role not found");
        }

        res.status(200).json({
            message: "Role deleted successfully",
            error: false,
            success: true,
            data: deletedRole
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteRoleController;
