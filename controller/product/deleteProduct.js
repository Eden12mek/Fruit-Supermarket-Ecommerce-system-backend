const deleteProductPermission = require("../../helpers/permission");
const productModel = require('../../models/productModel');

async function deleteProductController(req, res) {
    try {
        const sessionUserId = req.userId;
        const { productId } = req.body;

        // Check permission
        if (!deleteProductPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        // Validate product ID
        if (!productId) {
            throw new Error("Product ID is required");
        }

        // Find and delete the product
        const deletedProduct = await productModel.findOneAndDelete({
            _id: productId
        });

        if (!deletedProduct) {
            throw new Error("Product not found");
        }

        res.status(200).json({
            message: "Product deleted successfully",
            error: false,
            success: true,
            data: deletedProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController