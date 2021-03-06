var connect = require('connect');

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

function authenticateWithDatabase(user, pass, callback) {
    var err;
    if (user != 'tobi' || pass != 'ferret') {
        err = new Error('Unauthorized');
    }
    callback(err);
}

function restrict(req, res, next) {
    return next(new Error('Unauthorized'));
}

function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
            break;
    }
}

connect()
    .use(logger)
    //.use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000);
