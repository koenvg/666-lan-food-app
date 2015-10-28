var productController = require('../controllers/product');
var passportConf = require('../config/passport');

module.exports = function(app) {

    app.get('/product', passportConf.isAuthenticated, productController.viewProducts);
    app.post('/product', passportConf.isAuthenticated, productController.addProduct);
    app.post('/product/:productId/delete', passportConf.isAuthenticated, productController.deleteProduct);


    app.param('productId', productController.product);
    //app.param('userId', userController.user);
};