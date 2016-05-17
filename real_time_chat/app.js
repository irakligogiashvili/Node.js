var http = require('http')
    , path = require('path')
    , staticFile = require('./modules/send_file');

var ROOT = __dirname;
ROOT = path.join(ROOT, 'public');

var server = http.createServer(function (request, response) {

    if (request.url.indexOf('/public') != -1) {
        staticFile(request, response, ROOT);
    }

    console.log('createServer');
});

server.listen(3000);