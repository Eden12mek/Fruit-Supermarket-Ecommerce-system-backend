// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//   product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
//   amount: { type: Number, required: true },
//   tx_ref: { type: String, required: true, unique: true },
//   type: { type: String, required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'success', 'failed', 'approved'], 
//     default: 'pending' 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date }
// });

// paymentSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// module.exports = mongoose.model('Payment', paymentSchema);

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, },
  product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  tx_ref: { type: String, required: true, unique: true },
  type: { type: String, required: true },
status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'approved'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


module.exports = mongoose.model('Payment', paymentSchema);