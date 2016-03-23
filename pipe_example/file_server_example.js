var http = require('http')
    , fs = require('fs')
    , parse = require('url').parse
    , join = require('path').join;

var root = __dirname;

var server = http.createServer(function (req, res) {
    var url = parse(req.url);
    var path = join(root, url.pathname);
    var stream = null;

    fs.stat(path, function (err, stat) {
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            stream = fs.createReadStream(path);
            stream.pipe(res);

            stream.on('error', function (err) {
                console.log('stream error');
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        }
    });

    res.on('close', function () {
        if (stream)stream.close();
    });
});

server.listen(3000);