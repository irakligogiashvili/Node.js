var http = require('http')
    , path = require('path')
    , staticFile = require('./modules/send_file');

var ROOT = __dirname;
ROOT = path.join(ROOT, 'public');

var urlMap = {
    '/': function (request, response) {
        response.end('/');
    },
    '/map': function (request, response) {
        response.end('map');
    }
};

var server = http.createServer(function (request, response) {

    if (request.url.indexOf('/public') != -1) {
        staticFile(request, response, ROOT);
    } else if (urlMap[request.url]) {

        urlMap[request.url](request, response);

    } else {
        response.statusCode = 404;
        response.end('Not Found');
    }
});

server.listen(3000);