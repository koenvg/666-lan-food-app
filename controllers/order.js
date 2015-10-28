var Product = require('../models/Product');
var Order = require('../models/Order');
var User = require('../models/User');

/**
 * Find product from url
 */
exports.getOrder = function(req, res, next, id) {
    Order.findOne({_id: id}).exec(function(err, order) {
        if (err) req.flash('errors', { msg: err.message });
        if (!order) req.flash('errors', { msg: "No order found" }); // TODO: redirect to 404
        req.order = order;
        next();
    });
};

exports.order = function(req, res, next){
    var user = req.user;
    Product.find({}, function(err, products) {
        if (err) {
            req.flash('errors', {msg: err});
            next(err);
        }
        User.findById(user._id).populate('orders').exec(function(err, user){
            if (err) {
                req.flash('errors', {msg: err});
                next(err);
            }
            var total = 0;
            user.orders.forEach(function(order){
                total += order.priceThen;
            });
            res.render('order', {
                title: 'Order',
                user: user,
                products: products,
                total: total
            });
        });
    });

};

exports.addOrder = function (req, res, next) {
    var product = req.product;
    var user = req.user;

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/order');
    }
    var order = new Order({
        productName: product.name,
        priceThen: product.price
    });

    order.save(function(err) {
        if (err) {
            req.flash('errors', { msg: err });
            next(err);
        } else {
            user.orders.push(order);
            user.save(function(err){
                if (err) {
                    req.flash('errors', { msg: err });
                    next(err);
                } else {
                    res.redirect('/order');
                }
            });
        }
    });
};

exports.deleteOrder = function(req, res, next){
    var order = req.order;

    order.remove(function(err) {
        if (err) {
            req.flash('errors', { msg: err });
            next(err);
        } else {
            res.redirect('/order');
        }
    });
};