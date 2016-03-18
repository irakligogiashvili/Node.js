var EventEmitter = require('events')
    , fs = require('fs')
    , util = require('util');

var watchDir = './event_emitter_example/watch'
    , processedDir = './event_emitter_example/done';

function Watcher(watchDir, processedDir) {
    EventEmitter.call(this);

    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

util.inherits(Watcher, EventEmitter);

Watcher.prototype.watch = function () {
    var watcher = this;

    fs.readdir(this.watchDir, function (err, files) {
        if (err) throw  err;

        for (var index in files) {
            watcher.emit('process', files[index]);
        }
    });
};

Watcher.prototype.start = function () {
    var watcher = this;

    this.watch();

    fs.watchFile(this.watchDir, function () { // watch
        watcher.watch();
    });
};

Watcher.prototype.copyFile = function (from, to, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(from);
    rd.on('error', done);

    var wr = fs.createWriteStream(to);
    wr.on('error', done);
    wr.on('close', function () {
        done(null, 1)
    });
    rd.pipe(wr);

    function done(err, success) {
        var success = success || 0;

        if (!cbCalled) {
            cb(err, success);
            cbCalled = true;
        }
    }
};

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function (file) {
    var watchFile = this.watchDir + '/' + file;
    var processedFile = this.processedDir + '/' + file.toLowerCase();

    this.copyFile(watchFile, processedFile, function (err, success) {
        if (err) throw  err;

        if (success == 1) {
            console.log('success');
        }
    });
});

watcher.start();