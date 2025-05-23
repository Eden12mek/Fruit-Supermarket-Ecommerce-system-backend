const categoryModel = require('../../models/categoryModel');

const getCategoryController = async (req, res) => {
    try {
        const allCategory = await categoryModel.find().sort({ createdAt: -1 });

        res.json({
            message: 'All Category',
            success: true,
            error: false,
            data: allCategory,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = getCategoryController;