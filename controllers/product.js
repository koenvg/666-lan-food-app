var Product = require('../models/Product');


/**
 * Find product from url
 */
exports.product = function(req, res, next, id) {
    Product.findOne({_id: id}).exec(function(err, product) {
        if (err) req.flash('errors', { msg: err.message });
        if (!product) req.flash('errors', { msg: "No product found" }); // TODO: redirect to 404
        req.product = product;
        next();
    });
};


exports.viewProducts = function(req, res, next){
    var user = req.user;
    Product.find({}, function(err, products){
        if(err){
            req.flash('errors', { msg: err });
            next(err);
        }
        res.render('product/view', {
            title: 'Product',
            user: user,
            products:products
        });
    });

};


exports.addProduct = function(req, res, next){
    req.assert('name', 'Please enter a valid product').notEmpty();
    req.assert('price', 'Please enter a price').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/not-a-product');
    }
    var product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    product.save(function(err) {
        if (err) {
            console.log(err);
            req.flash('errors', { msg: err });
            next(err);
        } else {
            res.redirect('/not-a-product');
        }
    });
};

exports.deleteProduct = function(req, res, next){
    var product = req.product;

    product.remove(function(err) {
        if (err) {
            req.flash('errors', { msg: err });
            next(err);
        } else {
            res.redirect('/not-a-product');
        }
    });
};