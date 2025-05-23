const Role = require('../../models/roleModel');
const rolePermission = require('../../helpers/permission');

async function updateRoleController(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!rolePermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        const { _id, ...rest } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(_id, rest, { new: true });

        res.json({
            message: "Role updated successfully",
            data: updatedRole,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateRoleController;
