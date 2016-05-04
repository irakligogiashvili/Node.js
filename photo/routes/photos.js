var Photo = require('../models/Photo');
var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var join = path.join;

exports.list = function (req, res, next) {
    Photo.find({}, function (err, photos) {
        if (err) return next(err);
        res.render('photos', {
            title: 'Photos',
            photos: photos
        });
    });
};

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submit = function (dir) {
    return function (req, res, next) {
        var form = new multiparty.Form({
            encoding: 'utf8',
            autoFiles: true,
            uploadDir: dir,
            maxFields: 10,
            maxFilesSize: 2097152
        });

        form.parse(req, function (err, fields, files) {
            if (err) return next(err);

            var img = files.image[0];
            var name = fields.name[0] || img.originalFilename;

            var filePath = path.basename(img.path);

            Photo.create({
                name: name,
                path: filePath
            }, function (err) {
                if (err) return next(err);

                res.redirect('/');
            });
        });

        form.on('error', function (err) {
            if (err) return next(err);
        });
    }
};