const Role = require('../../models/roleModel');
const rolePermission = require('../../helpers/permission');

async function createRoleController(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!rolePermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        const role = new Role(req.body);
        const savedRole = await role.save();

        res.status(201).json({
            message: "Role created successfully",
            error: false,
            success: true,
            data: savedRole
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = createRoleController;
