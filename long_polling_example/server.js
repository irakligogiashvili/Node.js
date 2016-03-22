var http = require('http')
    , fs = require('fs'),
    chat = require('./chat');

http.createServer(function (req, res) {
    switch (req.url) {
        case '/subscribe':
            chat.subscribe(req, res);
            break;
        case '/publish':
            var body = '';

            req.on('readable', function () {
                body += req.read();

                if (body.length > 1e4) {
                    res.statusCode = 413;
                    res.end('Too Big');
                }
            });

            req.on('end', function () {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    res.statusCode = 400;
                    res.end('Bad Request');
                    return;
                }
            });

            chat.publish(body.message);
            res.end('OK');
            break;

        default :
            res.statusCode = 400;
            res.end('Not Found');
    }
}).listen(3000);