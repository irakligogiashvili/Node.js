var fs = require('fs'),
    readline = require('readline');

var file = './storage_example/tasks.json';

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('> ');
rl.prompt();

rl.on('line', function (line) {
    var args = line.split(' ');
    var command = args.shift().trim();
    var taskDescription = args.join(' ');

    switch (command) {
        case 'list':
            listTasks(file);
            break;

        case 'add':
            addTask(file, taskDescription);
            break;

        default:
            console.log('Usage: ' + process.argv[0]
                + ' list|add [taskDescription]');
    }

    rl.prompt();
}).on('close', function () {
    console.log('Have a great day!');
    process.exit(0);
});

function loadOrInitializeTaskArray(file, cb) {
    fs.exists(file, function (exists) {
        var tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) throw err;
                var data = data.toString();
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            });
        } else {
            cb([]);
        }
    });
}

function listTasks(file) {
    loadOrInitializeTaskArray(file, function (tasks) {
        for (var i in tasks) {
            console.log(tasks[i]);
        }
        setPrompt();
    });
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved.');
        setPrompt();
    });
}

function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}

function setPrompt() {
    rl.prompt();
}