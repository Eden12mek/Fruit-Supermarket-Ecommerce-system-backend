const Role = require('../../models/roleModel');

async function getRolesController(req, res) {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });

        res.json({
            message: "All roles fetched successfully",
            data: roles,
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

module.exports = getRolesController;
