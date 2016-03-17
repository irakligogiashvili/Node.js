var EventEmitter = require('events')
    , net = require('net')
    , util = require('util');


function NetSocketEmitter() {
    EventEmitter.call(this);
}

util.inherits(NetSocketEmitter, EventEmitter);

var channel = new NetSocketEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    this.clients[id] = client;

    this.subscriptions[id] = function (senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    };

    this.on('broadcast', this.subscriptions[id]);
});

channel.on('disconnectClient', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, "\r\n" + id + " Disconnect!\r\n");
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;

    channel.emit('join', id, client);

    client.on('data', function (data) {
        data = data.toString();
        channel.emit('broadcast', id, data);
    });

    client.on('close', function () {
        channel.emit('disconnectClient', id);
    });
});
server.listen(8888);
