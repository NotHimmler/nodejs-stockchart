var child = require('child_process');

var python = child.exec('python google_finance.py GOOG', (error, stdout, stderror) => {
    if (error) {
        console.error('exec error: ' + error);
        return
    }

    console.log('stdout: ' + stdout + "stdout == true: " + (JSON.parse(stdout) == true));
    console.log('stderror: ' + stderror);
});