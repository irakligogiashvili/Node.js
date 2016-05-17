module.exports.sendResponse = sendResponse;

function sendResponse(res, error) {
    res.statusCode = error.code;
    res.end(error.msg);
}