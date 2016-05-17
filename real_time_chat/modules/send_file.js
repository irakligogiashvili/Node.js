var fs = require('fs')
    , url = require('url'),
    path = require('path');

module.exports = sendFile;

function sendFile(req, res, root) {
    var ROOT = root;

    var stream = null,
        filePath = url.parse(req.url).pathname;

    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        sendResponse(400, 'Bad Request');
        return;
    }

    if (~filePath.indexOf('\0')) {
        sendResponse(400, 'Bad Request');
        return;
    }

    var arr = filePath.split("/");
    arr.splice(0, 2);
    filePath = arr.join('/');

    filePath = path.normalize(path.join(ROOT, filePath));

    if (filePath.indexOf(ROOT) != 0) {
        sendResponse(404, 'Not Found');
        return;
    }

    fs.stat(filePath, function (err, stat) {
        if (err) {
            if ('ENOENT' == err.code) {
                sendResponse(404, 'Not Found');
                return;
            } else if (!stat.isFile()) {
                sendResponse(404, 'Not Found');
                return;
            } else {
                sendResponse(500, 'Internal Server Error');
                return;
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            stream = fs.createReadStream(filePath);
            stream.pipe(res);

            stream.on('error', function (err) {
                sendResponse(500, 'Internal Server Error');
                return;
            });
        }
    });

    res.on('close', function () {
        if (stream)stream.close();
    });
}

function sendResponse(code, text) {
    res.statusCode = code;
    res.end(text);
}