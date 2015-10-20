var _ = require('lodash');
var fs = require('fs');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
var regex = /^data:.+\/(.+);base64,(.*)$/;
var basePath = "public/images/faces/";

exports.createUser = function(req, res) {
    var name = req.body.name;
    var image = req.body.image;

    var matches = image.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');
    fs.writeFile(basePath+ 'data.' + ext, buffer, function(err){
        if(err){
            console.err(err);
        }
    });

    res.json({"user": "bar"});
};