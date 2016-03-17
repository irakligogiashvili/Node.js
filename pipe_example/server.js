var http = require('http')
    , fs = require('fs');

var proxy = http.createServer(function (req, res) {

    var file = new fs.createReadStream("pipe_example/big.html", {
        defaultEncoding: 'utf8',
        autoClose: true,
        flags: 'r'
    });

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

    file.on('open', function () {
        console.log('open');
    });

    file.on('close', function () {
        console.log('close');
    });

    file.on('error', function (err) {
        res.statusCode = 500;
        res.end("Error!");

        console.log(err);
    });

    res.on('close', function () {
        file.close();
        file.destroy();
        console.log('on res close');
    });
}

/*
 function sendFile(file, res) {
 file.pipe(res);
 }*/
