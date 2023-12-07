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

return true;