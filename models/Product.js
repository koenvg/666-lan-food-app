var mongoose = require('mongoose');


var productSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    price: {type: Number}
});


module.exports = mongoose.model('Product', productSchema);
