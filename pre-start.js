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

runCommand = (command) => {
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            stdout && console.log(stdout);
            stderr && console.error(stderr);
        }
    });
}

runCommand('git remote add origin git@github.com:hiddenesteel/SillyTavern.git')

console.log('-----------------')
console.log('setting interval')
setInterval(() => {
    const date = new Date();


    runCommand('git add .');
    runCommand(`git commit -m '${date.toISOString()}'`);
    runCommand('git push origin story');
}, 600000);
console.log('-----------------')

return true;