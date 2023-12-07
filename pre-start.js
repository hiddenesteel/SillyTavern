const { exec } = require('child_process');

console.log('-----------------')
console.log('setting interval')
setInterval(()=> {
    exec('pwd', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
        } else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
    });
}, 600000);
console.log('-----------------')