var orderController = require('../controllers/order');
var passportConf = require('../config/passport');
var productController = require('../controllers/product');
module.exports = function(app) {

    app.get('/order', passportConf.isAuthenticated, orderController.order);
    app.post('/order/:productId', passportConf.isAuthenticated, orderController.addOrder);
    app.post('/order/:orderId/delete', passportConf.isAuthenticated, orderController.deleteOrder);

    app.param('productId', productController.product);
    app.param('orderId', orderController.getOrder);
    //app.param('userId', userController.user);
};