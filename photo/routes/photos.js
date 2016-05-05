var Photo = require('../models/Photo');
var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var join = path.join;
var IMAGE_TYPES = ['image/jpeg', 'image/png'];
var IMAGE_EXT = ['jpeg', 'png', 'jpg'];

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
            var extension = img.path.split(/[. ]+/).pop();
            var type = mime.lookup(img.path);

            if (IMAGE_TYPES.indexOf(type) == -1 || IMAGE_EXT.indexOf(extension) == -1) {
                fs.unlink(img.path, function (err) {
                    if (err) return next(err);

                    return next(new Error("Not allowed mime type"));
                });
            }

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

exports.download = function (dir) {
    return function (req, res, next) {
        var id = req.params.id;

        Photo.findById(id, function (err, photo) {
            if (err) return next(err);
            var filePath = join(dir, photo.path);
            var ext = path.extname(filePath);

            res.download(filePath, photo.name + ext);
        });
    };
};