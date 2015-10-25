var _ = require('lodash');
var fs = require('fs');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
var regex = /^data:.+\/(.+);base64,(.*)$/;
var basePath = "public/images/faces/";
var request = require('request');
var uuid = require('uuid');

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
            "gallery_name":"selfServiceTest2",
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
                    res.status(500).json(err);
                }else{
                    res.json(user);
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