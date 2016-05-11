var fs = require('fs');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

var outFileName = 'clobstream2out.txt';

oracledb.getConnection(
    {
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
    },
    function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }

        connection.execute(
            "SELECT NOTE FROM PROTOCOLS.PROTOCOLS WHERE NOTE is NOT NULL",
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                if (result.rows.length === 0) {
                    console.log("No results");
                    return;
                }

                var clob = '';
                var lob = result.rows[0][0];

                if (lob === null) {
                    console.log("CLOB was NULL");
                    return;
                }

                console.log('CLOB length is ' + lob.length);
                console.log("CLOB chunkSize is", lob.chunkSize);

                lob.setEncoding('utf8');

                lob.on('data',
                    function (chunk) {
                        console.log("lob.on 'data' event");
                        console.log('  - got %d bytes of data', chunk.length);
                        clob += chunk;
                        // an alternative (not shown) would be to write each chunk out
                    });
                lob.on('end',
                    function () {
                        console.log("lob.on 'end' event");
                        console.log("clob size is " + clob.length);
                        fs.writeFile(outFileName, clob, function (err) {
                            if (err)
                                console.error(err);
                            else
                                console.log("Completed write to " + outFileName);
                        });
                    });
                lob.on('close',
                    function () {
                        console.log("lob.on 'close' event");
                        connection.release(function (err) {
                            if (err) console.error(err);
                        });
                    });
                lob.on('error',
                    function (err) {
                        console.log("lob.on 'error' event");
                        console.error(err);
                    });
            });
    });