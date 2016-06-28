var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/video', function(err, db){
    assert.equal(null, err);

    console.log('Successsfully connected to server');

    db.collection('movies').find({}).toArray(function (err, docs) {
        docs.forEach(function (doc) {
            console.log(doc.title);
        });

        db.close();
    });

    console.log('Called find()');
});