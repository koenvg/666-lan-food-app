var userController = require('../controllers/user');
var passportConf = require('../config/passport');
module.exports = function(app) {

    app.post('/user', userController.createUser);
    app.get('/user', userController.createUser);



    //app.param('userId', userController.user);
};