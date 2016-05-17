var staticFile = require('../modules/send_file').send;

var urlMap = {
    '/': function (request, response) {
        staticFile(response, "server/public/index.html");
    },
    '/map': function (request, response) {
        response.end('map');
    }
};

module.exports.router = urlMap;