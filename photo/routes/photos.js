var mongoose = require('mongoose')
    , multiparty = require('multiparty')
    , path = require('path')
    , fs = require('fs')
    , mime = require('mime')
    , shortId = require('shortid')
    , Grid = require('gridfs-stream')
    , http = require('http');

mongoose.connect('mongodb://localhost/photo_app');
var conn = mongoose.connection;

var gfs;
Grid.mongo = mongoose.mongo;

conn.once('open', function () {
    gfs = Grid(conn.db);
});

var IMAGE_TYPES = ['image/jpeg', 'image/png'];
var IMAGE_EXT = ['jpeg', 'png', 'jpg'];

exports.list = function (req, res, next) {
    gfs.files.find({}).toArray(function (err, files) {
        if (err) return next(err);

        res.render('photos', {
            title: 'Photos',
            photos: files
        });
    });
};

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submit = function (req, res, next) {
    var form = new multiparty.Form({
        encoding: 'utf8',
        maxFields: 10,
        autoFiles: true,
        maxFilesSize: 2097152
    });

    var writestream = null;

    form.parse(req, function (err, fields, files) {
        if (err) return next(err);

        var img = files.image[0];
        var name = fields.name[0] || img.originalFilename;
        var extension = img.path.split(/[. ]+/).pop();
        var type = mime.lookup(img.path);

        if (IMAGE_TYPES.indexOf(type) == -1 || IMAGE_EXT.indexOf(extension) == -1) {
            fs.unlink(img.path, function (err) {
                if (err) return next(err);

                return next(new Error("Not allowed mime type"));
            });
        } else {
            writestream = gfs.createWriteStream({
                metadata: {
                    name: name,
                    contentType: type
                },
                filename: shortId.generate() + '.' + extension
            });

            fs.createReadStream(img.path).pipe(writestream);

            writestream.on('close', function (file) {
                fs.unlink(img.path, function (err) {
                    if (err) return next(err);

                    res.redirect('/');
                });
            });

            writestream.on('error', function (err) {
                if (err) return next(err);
            });
        }
    });

    form.on('error', function (err) {
        if (err) return next(err);
    });

    res.on('close', function () {
        if (writestream)writestream.close();
    });
};

exports.download = function (req, res, next) {
    var id = req.params.id;
    var readstream = null;

    gfs.exist({_id: id}, function (err, found) {
        if (err) return next(err);

        if (found) {
            var readstream = gfs.createReadStream({
                _id: id
            });

            readstream.on('error', function (err) {
                if (err) return next(err);
            });

            readstream.pipe(res);
        } else {
            res.send(404);
        }
    });

    res.on('close', function () {
        if (readstream)readstream.close();
    });
};