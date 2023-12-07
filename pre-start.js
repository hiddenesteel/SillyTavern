const fs = require('fs');
const ejs = require('ejs');
const yaml = require('js-yaml');
const { exec } = require('child_process');

console.log('-----------------')
console.log('reading env var')

const configTemplate = fs.readFileSync('config.yaml', 'utf8');
const configString = ejs.render(configTemplate);

try {
    const config = yaml.load(configString, 'utf-8');
    const yamlStr = yaml.dump(config);

    fs.writeFileSync('config.yaml', yamlStr, 'utf8');
} catch (e) {
    console.error(e);
}
console.log('-----------------')

console.log('-----------------')
console.log('setting interval')
setInterval(() => {
    exec('git add .', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            stdout && console.log(stdout);
            stderr && console.error(stderr);
        }
    });

    exec(`git commit -m ${new Date()}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            stdout && console.log(stdout);
            stderr && console.error(stderr);
        }
    });

    exec('git push', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            stdout && console.log(stdout);
            stderr && console.error(stderr);
        }
    });
}, 600000);
console.log('-----------------')

return true;