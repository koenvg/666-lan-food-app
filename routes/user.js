var userController = require('../controllers/user');
var passportConf = require('../config/passport');
module.exports = function(app) {

    app.post('/user', userController.createUser);

    app.get('/register', userController.viewRegister);
    app.get('/logout', userController.logout);
    app.post('/login', userController.login);
    app.get('/login', userController.showLoginPage);

    app.post('/user/:userId/login', userController.loginWithThatUser);


    app.param('userId', userController.user);


    //app.param('userId', userController.user);
};