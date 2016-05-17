var urlMap = {
    '/': function (request, response) {
        response.end('/');
    },
    '/map': function (request, response) {
        response.end('map');
    }
};

module.exports.router = urlMap;