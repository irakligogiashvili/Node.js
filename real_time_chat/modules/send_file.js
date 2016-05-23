var fs = require('fs')
    , sendResponse = require('./util').sendResponse
    , path = require('path');

module.exports.sendFile = sendFile;
module.exports.send = send;

function sendFile(res, filePath, root) {
    var filePath = filePath, ROOT = root;

    var arr = filePath.split("/");
    arr.splice(0, 2);
    filePath = arr.join('/');

    filePath = path.normalize(path.join(ROOT, filePath));

    if (filePath.indexOf(ROOT) != 0) {
        sendResponse(res, {error: 404, msg: 'Not Found'});
        return;
    }

    send(res, filePath);
}

function send(res, filePath) {
    var stream = null;

    fs.stat(filePath, function (err, stat) {
        if (err) {
            if ('ENOENT' == err.code) {
                sendResponse(res, {error: 404, msg: 'Not Found'});
                return;
            } else if (!stat.isFile()) {
                sendResponse(res, {error: 404, msg: 'Not Found'});
                return;
            } else {
                sendResponse(res, {error: 500, msg: 'Internal Server Error'});
                return;
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            stream = fs.createReadStream(filePath);
            stream.pipe(res);

            stream.on('error', function (err) {
                sendResponse(res, {error: 500, msg: 'Internal Server Error'});
                return;
            });
        }
    });

    res.on('close', function () {
        if (stream)stream.close();
    });
}