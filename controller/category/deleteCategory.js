const deleteCategoryPermission = require("../../helpers/permission");
const categoryModel = require('../../models/categoryModel');


async function deleteCategoryController(req, res) {
  try {
    console.log('Request body:', req.body) // Debug log
    
    const sessionUserId = req.userId
    if (!deleteCategoryPermission(sessionUserId)) {
      return res.status(403).json({
        message: "Permission denied",
        error: true,
        success: false
      })
    }

    const { _id } = req.body
    if (!_id) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false
      })
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(_id)
    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false
      })
    }

    res.json({
      message: 'Category deleted successfully',
      error: false,
      success: true,
      data: deletedCategory
    })

  } catch (err) {
    console.error('Delete error:', err) // Debug log
    res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false
    })
  }
}

module.exports = deleteCategoryController;