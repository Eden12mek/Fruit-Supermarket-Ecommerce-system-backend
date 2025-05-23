const updateCategoryPermission = require('../../helpers/permission');
const categoryModel = require('../../models/categoryModel');

async function updateCategoryController(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!updateCategoryPermission(sessionUserId)) {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false
            });
        }

        const { _id, ...updateData } = req.body;

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true } // Return updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: 'Category updated successfully',
            data: updatedCategory,
            success: true,
            error: false,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Server error",
            error: true,
            success: false,
        });
    }
}


module.exports = updateCategoryController;