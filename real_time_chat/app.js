var http = require('http')
    , path = require('path')
    , url = require('url')
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
    var urlPath = url.parse(request.url).pathname;

    if (request.url.indexOf('/public') != -1) {
        staticFile(request, response, ROOT);
    } else if (urlMap[urlPath]) {

        urlMap[urlPath](request, response);

    } else {
        response.statusCode = 404;
        response.end('Not Found');
    }
});

server.listen(3000);