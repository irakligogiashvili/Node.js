var redis = require('redis'),
    client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.set('color', 'red', redis.print);

client.get('color', function (err, value) {
    if (err) throw err;
    console.log('Got: ' + value);
});

client.hmset('camping', {
    'shelter': '2-person tent',
    'cooking': 'campstove'
}, redis.print);

client.hget('camping', 'cooking', function (err, value) {
    if (err) throw err;
    console.log('Will be cooking with: ' + value);
});

client.hkeys('camping', function (err, keys) {
    if (err) throw err;
    keys.forEach(function (key, i) {
        console.log(' ' + key);
    });
});

client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});

//HMSET is like HSET, but it allows multiple field/value pairs to be set at once.
