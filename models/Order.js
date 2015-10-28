var mongoose = require('mongoose');


var orderSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now},
    productName: {type: String},
    priceThen: {type: Number}
});


module.exports = mongoose.model('Order', orderSchema);
