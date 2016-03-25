var http = require('http')
    , counter = 0;

var server = http.createServer(function (req, res) {
    counter++;

    res.write('I have been accessed ' + counter + ' times.');
    res.end();
}).listen(8888);