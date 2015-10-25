var orderController = require('../controllers/order');
var passportConf = require('../config/passport');
module.exports = function(app) {

    app.get('/order', passportConf.isAuthenticated, orderController.order);

    //app.param('userId', userController.user);
};