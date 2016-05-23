var http = require('http')
    , path = require('path')
    , parser = require('./modules/request_parser.js');

var ROOT = path.join(__dirname, 'public');

var server = http.createServer(function (request, response) {
    parser(request, response, ROOT);
});

server.listen(3000);