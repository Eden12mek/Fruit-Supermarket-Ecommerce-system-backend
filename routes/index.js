const express = require('express')

const router = express.Router()
const { body } = require('express-validator');
const paymentController = require('../controller/payment/payment');

const paymentValidationRules = [
  body('userId').isString().withMessage('User ID must be a string'), // Changed to string for MongoDB ObjectId
  body('productId').isString().withMessage('Product ID must be a string'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('type').isString().withMessage('Type must be a string'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('firstName').isString().withMessage('First name must be a string'),
  body('lastName').isString().withMessage('Last name must be a string'),
  body('phoneNumber').isString().withMessage('Phone number must be a string')
];


const {userSignUpController, addAdminEmployeeController} = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const deleteUser = require('../controller/user/deleteUser')
const addCategory = require('../controller/category/addCategory')
const getCategory = require('../controller/category/getCategory')
const updateCategoryController = require('../controller/category/updateCategory')
const deleteCategoryController = require('../controller/category/deleteCategory')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const getProductByCategory = require('../controller/product/getProductByCategory')
const updateProductController = require('../controller/product/updateProduct')
const deleteProductController = require('../controller/product/deleteProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const initiatePaymentController = require('../controller/payment/payment')
const confirmPaymentController = require('../controller/payment/payment')
const paymentCallbackController = require('../controller/payment/payment');
const { createMessage, getAllMessages, deleteMessage } = require('../controller/message/messageController');
const { getNotifications, markAsRead, markAllAsRead, createNotification } = require('../controller/notification/notification');
const createRoleController = require('../controller/role/createRole')
const updateRoleController = require('../controller/role/updateRole')
const deleteRoleController = require('../controller/role/deleteRole')
const getRolesController = require('../controller/role/getRole')

router.post("/signup",userSignUpController)
router.post('/add-admin-employee', addAdminEmployeeController);
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)


// role
router.post("/add-role", authToken, createRoleController )
router.get("/all-role", authToken,getRolesController)
router.post("/update-role", authToken, updateRoleController)
router.post("/delete-role", authToken, deleteRoleController)


//admin panel 
router.get("/all-user",authToken,allUsers)
router.patch("/update-user",authToken,updateUser)
router.post("/delete-user",authToken,deleteUser)

//category
router.post("/add-category",authToken,addCategory)
router.get("/get-category",getCategory)
router.post("/update-category",authToken,updateCategoryController)
router.post("/delete-category",authToken,deleteCategoryController)

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.post("/delete-product",authToken,deleteProductController)
router.get("/get-product-by-category",authToken,getProductByCategory)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

// payment
router.post('/initiate', paymentValidationRules, paymentController.initiatePayment);
router.post('/confirm', paymentController.confirmPayment);
router.post('/callback', paymentController.paymentCallback);
router.get('/all-payments', paymentController.getAllPayments);
router.patch('/approve/:paymentId', paymentController.approvePayment);

// message
router.post("/create-message", createMessage);
router.get("/all-messages", authToken, getAllMessages);
router.delete("/delete-message/:id", authToken, deleteMessage);

// notification
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markAsRead);
router.patch('/notifications/mark-all-read', markAllAsRead);
router.post('/', createNotification);



module.exports = router