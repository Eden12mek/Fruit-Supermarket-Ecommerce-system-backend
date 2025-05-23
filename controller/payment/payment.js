
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const Payment = require('../../models/payment');
const Notification = require('../../models/notificationModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

const initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { userId, productId,  amount, type, email, firstName, lastName, phoneNumber } = req.body;
  
  // Validate that productId exists
  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product information is missing' });
  }
  const tx_ref = `tx-${uuidv4()}`;

  try {
    // Calculate amount per product if it's a cart payment
    const amount = req.body.type === 'cart' 
      ? req.body.amount 
      : totalPrice;

    const chapaResponse = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency: 'ETB',
        email: req.body.email,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        phone_number: req.body.phoneNumber,
        tx_ref: req.body.tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/payment/callback`,
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        'customization[title]': req.body.type === 'cart' ? 'Cart Payment' : 'Product Payment',
        'customization[description]': 'Thank you for your purchase',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save payment record for each product in cart
    if (req.body.type === 'cart') {
      const newPayment = new Payment({
        user_id: req.body.userId,
        product_id: req.body.productId,
        amount: req.body.amount,
        quantity: req.body.quantity,
        tx_ref: req.body.tx_ref,
        type: req.body.type,
        status: 'pending'
      });

      await newPayment.save();
    } else {
      return res.status(500).json({ success: false, message: 'Failed to initiate payment with Chapa' });
    }
 res.json({
      success: true,
      tx_ref: req.body.tx_ref,
      checkout_url: chapaResponse.data.data.checkout_url,
      message: 'Payment initiated',
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed',
      error: error.message 
    });
  }
};

const confirmPayment = async (req, res) => {
  const { tx_ref } = req.body;
  console.log('Verifying payment with tx_ref:', tx_ref);

  try {
    const payment = await Payment.findOne({ tx_ref });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          'Authorization': 'Bearer CHASECK_TEST-tH9UqJt6mjhpd7vddLd1cnDAohZMrB49',
        },
      }
    );

    const chapaResponse = response.data;
    console.log("Chapa API response:", chapaResponse);

    if (chapaResponse.status === 'success' && chapaResponse.data?.status === 'success') {
      await Payment.updateOne({ tx_ref }, { status: 'success' });
      const updatedPayment = await Payment.findOne({ tx_ref });
      return res.json({ success: true, message: 'Payment successful', payment: updatedPayment });
    } else {
      return res.json({ 
        success: false, 
        message: 'Payment failed or not verified',
        details: chapaResponse.message || 'No additional error details'
      });
    }
  } catch (error) {
    if (error.response) {
      console.error('🔴 Chapa API error:', error.response.data);
      return res.status(500).json({
        success: false,
        message: error.response.data.message || 'Chapa API error',
        chapaError: error.response.data,
      });
    } else if (error.request) {
      console.error('🟠 No response from Chapa:', error.request);
      return res.status(500).json({ success: false, message: 'No response from Chapa' });
    } else {
      console.error('🟡 Unexpected error:', error.message);
      return res.status(500).json({ success: false, message: 'Unexpected error occurred' });
    }
  }
};
const paymentCallback = async (req, res) => {
  const { tx_ref, status } = req.body;
  
  try {
    if (status === 'success') {
      await Payment.updateOne({ tx_ref }, { status: 'success' });
      
      // Here you can also update your booking status
      // await Booking.updateOne({ paymentId: tx_ref }, { status: 'confirmed' });
      
      return res.status(200).send('Callback processed');
    } else {
      await Payment.updateOne({ tx_ref }, { status: 'failed' });
      return res.status(200).send('Callback processed - payment failed');
    }
  } catch (error) {
    console.error('Callback processing error:', error);
    return res.status(500).send('Error processing callback');
  }
};

// In your payment controller
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, startDate, endDate } = req.query
    
    const query = {}
    
    if (search) {
      query.$or = [
        { tx_ref: { $regex: search, $options: 'i' } },
        { 'user_id.name': { $regex: search, $options: 'i' } },
        { 'user_id.email': { $regex: search, $options: 'i' } }
      ]
    }
    
    if (status) {
      query.status = status
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    // Get paginated results
    const payments = await Payment.find(query)
      .populate('user_id', 'name email')
      .populate('product_id', 'productName sellingPrice')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
    
    // Get counts for stats
    const total = await Payment.countDocuments(query)
    const successfulPayments = await Payment.countDocuments({ ...query, status: 'success' })
    const pendingPayments = await Payment.countDocuments({ ...query, status: 'pending' })
    const failedPayments = await Payment.countDocuments({ ...query, status: 'failed' })
    const approvedPayments = await Payment.countDocuments({ ...query, status: 'approved' });
    
    // Calculate total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { ...query, status: { $in: ['success', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0
    
    res.json({
      success: true,
      data: {
        payments,
        total,
        successfulPayments,
        pendingPayments,
        failedPayments,
        approvedPayments,
        totalRevenue
      }
    })


  } catch (error) {
    console.error('Error fetching payments:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    })
  }
}

const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'approved' },
      { new: true }
    ).populate('user_id').populate('product_id');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Create a notification for the user
    const notification = new Notification({
      user_id: payment.user_id._id,
      type: 'payment_approved',
      message: `Your order is approved! You can collect it with contact: ${'our store contact: 0987456123 '}`,
      related_id: payment._id,
      read: false
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Payment approved successfully',
      payment
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve payment',
      error: error.message
    });
  }
};


module.exports = {
  initiatePayment,
  confirmPayment,
  paymentCallback,
  getAllPayments,
  approvePayment
};