var express = require('express'),
    app = express(),
    cons = require('consolidate');

app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {error: err});
}

app.use(errorHandler);

app.get('/:name/:surname', function (req, res, next) {
    var name = req.params.name;
    var surname = req.params.surname;

    console.log(req.params.surname);

    var getvar1 = req.query.getvar1;
    var getvar2 = req.query.getvar2;

    res.render('hello', {name: name, surname: surname, getvar1: getvar1, getvar2: getvar2});
});

app.listen(3000);
console.log('Express server listening on port 3000');
