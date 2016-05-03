var connect = require('connect')
    , basicAuth = require('basic-auth-connect');

var users = {
    tobi: 'foo',
    loki: 'bar',
    jane: 'baz'
};


connect()
    .use(basicAuth(function (user, pass) {
        return users[user] === pass;
    })).listen(3000);
