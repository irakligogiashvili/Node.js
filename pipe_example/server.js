var http = require('http')
    , fs = require('fs');

var proxy = http.createServer(function (req, res) {

    var file = new fs.createReadStream("pipe_example/big.html");

    sendFile(file, res);
});

proxy.listen(3000, '127.0.0.1');

function sendFile(file, res) {
    file.on('readable', write);

    function write() {
        var fileContent = file.read();

        if (fileContent && !res.write(fileContent)) {
            file.removeListener('readable', write);

            res.once('drain', function () {
                file.on('readable', write);
                write();
            });
        }
    }

    file.on('end', function () {
        res.end();
    });
}

/*
function sendFile(file, res) {
    file.pipe(res);
}*/
