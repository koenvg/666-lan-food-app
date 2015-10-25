var userController = require('../controllers/user');
var passportConf = require('../config/passport');
module.exports = function(app) {

    app.post('/user', userController.createUser);

    app.get('/register', userController.viewRegister);
    app.post('/login', userController.login);


    //app.param('userId', userController.user);
};