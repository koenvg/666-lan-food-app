var _ = require('lodash');
var fs = require('fs');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
var regex = /^data:.+\/(.+);base64,(.*)$/;
var basePath = "public/images/faces/";
var request = require('request');
var uuid = require('uuid');


/**
 * Find user from url
 */
exports.user = function(req, res, next, id) {
    User.findOne({_id: id}).exec(function(err, user) {
        if (err) req.flash('errors', { msg: err.message });
        if (!user) req.flash('errors', { msg: "No user found" }); // TODO: redirect to 404
        req.user = user;
        next();
    });
};

exports.createUser = function(req, res, next) {
    var name = req.body.name;
    var image = req.body.image;

    var matches = image.match(regex);
    var data = matches[2];
    var imageId = uuid.v1();

    request.post({
        headers: {
            'content-type' : 'application/json',
            'app_key': secrets.face.app_key,
            'app_id': secrets.face.app_id
        },
        url: 'https://api.kairos.com/enroll',
        body:    JSON.stringify({
            "image":data,
            "subject_id":imageId,
            "gallery_name":secrets.face.galeryId,
            "selector":"SETPOSE",
            "symmetricFill":"true"
        })
    }, function(error, response, body){
        var data = JSON.parse(body);

        if (data.Errors) {
            res.status(500).json(data);
        }else{
            var user = new User({
                name: name,
                faceId: imageId
            });
            user.save(function(err){
                if(err){
                    //remove the face
                    request.post({
                        headers: {
                            'content-type' : 'application/json',
                            'app_key': secrets.face.app_key,
                            'app_id': secrets.face.app_id
                        },
                        url: 'https://api.kairos.com/gallery/remove_subject',
                        body:    JSON.stringify({
                            "gallery_name": secrets.face.galeryId,
                            "subject_id": imageId
                        })
                    }, function(error, response,body){
                        console.log("removed image from gelary with id: " +imageId );
                        res.status(500).json(err);
                    });
                }else{
                    req.logIn(user, function(err) {
                        if (err) return next(err);
                        res.json(user);
                    });
                }
            });
            console.log(body);
        }
    });
};


/**
 *
 * @param req
 * @param res
 */
exports.login = function(req, res, next){
    passport.authenticate('face', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('errors', { msg: info.message });
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            res.json('success');
        });
    })(req, res, next);
};

exports.viewRegister = function(req, res){
    res.render('register', {
        title: 'Register'
    });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.showLoginPage = function(req, res){
    User.find({}, function(err, users){
        if (err) return next(err);
        res.render('login', {
            title: 'Users',
            users: users
        });
    });
};
exports.loginWithThatUser = function(req, res){
    var user = req.user;
    req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/order');
    });
};
