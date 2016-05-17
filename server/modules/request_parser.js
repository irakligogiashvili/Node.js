var url = require('url')
    , sendResponse = require('./util').sendResponse
    , router = require('../routes/router').router
    , staticFile = require('./send_file').sendFile
    , path = require('path');


module.exports = parser;

function parser(req, res, root) {
    var ROOT = root;
    var urlPathname = url.parse(req.url).pathname;

    try {
        urlPathname = decodeURIComponent(urlPathname);
    } catch (e) {
        sendResponse(res, {error: 400, msg: 'Bad Request'});
        return;
    }

    if (~urlPathname.indexOf('\0')) {
        sendResponse(res, {error: 400, msg: 'Bad Request'});
        return;
    }

    if (urlPathname.indexOf('/public') === 0) {
        staticFile(res, urlPathname, ROOT);
    } else if (router[urlPathname]) {

        router[urlPathname](req, res);

    } else {
        sendResponse(res, {error: 404, msg: 'Not Found'});
    }
}