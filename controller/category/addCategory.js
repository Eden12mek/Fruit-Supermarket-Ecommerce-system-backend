const addCategoryPermission = require('../../helpers/permission')
const categoryModel = require('../../models/categoryModel');

async function addCategoryController(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!addCategoryPermission(sessionUserId)) {
            throw new Error('Permission denied');
        }

        const { categoryName } = req.body;

        // Check if the category already exists
        const existingCategory = await categoryModel.findOne({ categoryName });
        if (existingCategory) {
            return res.status(400).json({
                message: 'Category already exists',
                error: true,
                success: false,
            });
        }

        const newCategory = new categoryModel(req.body);
        const savedCategory = await newCategory.save();

        res.status(201).json({
            message: 'Category added successfully',
            error: false,
            success: true,
            data: savedCategory,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}
module.exports = addCategoryController;