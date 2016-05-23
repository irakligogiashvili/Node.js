module.exports.sendResponse = sendResponse;

function sendResponse(res, error) {
    res.statusCode = error.error;
    res.end(error.msg);
}