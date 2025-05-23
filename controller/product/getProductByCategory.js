const productModel = require("../../models/productModel");

const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        
        if (!category) {
            return res.status(400).json({
                message: "Category ID is required",
                success: false,
                error: true
            });
        }

        // Find products that have this category in their category array
        const products = await productModel.find({
            category: mongoose.Types.ObjectId(category)
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'category',
            select: 'categoryName _id'
        })
        .limit(parseInt(req.query.limit) || 10) // Default to 10 if limit not specified

        res.json({
            message: "Products by category",
            success: true,
            error: false,
            data: products
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Error fetching products by category",
            error: true,
            success: false
        });
    }
};

module.exports = getProductByCategory;