const fs = require('fs');
const ejs = require('ejs');
const yaml = require('js-yaml');
const path = require('path');
const { google } = require('googleapis');

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
// Variables de entorno
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FOLDER_ID = process.env.FOLDER_ID;

// Autenticación
async function authenticate() {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    // TODO: Implementa el flujo para obtener el token de acceso
    // Puedes seguir la guía oficial de Google para manejar la autenticación OAuth2

    return oAuth2Client;
}

async function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth });
    try {
        const response = await drive.files.list({
            q: `'${FOLDER_ID}' in parents`,
            fields: 'files(id, name)',
        });
        return response.data.files;
    } catch (error) {
        console.error('Error al listar archivos:', error);
        return [];
    }
}

async function downloadFile(auth, fileId, filePath) {
    const drive = google.drive({ version: 'v3', auth });
    const dest = fs.createWriteStream(filePath);

    try {
        const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        response.data
            .on('end', () => console.log(`Descargado ${filePath}`))
            .on('error', err => console.error('Error al descargar archivo:', err))
            .pipe(dest);
    } catch (error) {
        console.error('Error al descargar:', error);
    }
}

async function syncFolder() {
    const auth = await authenticate();
    const files = await listFiles(auth);

    for (const file of files) {
        const filePath = path.join('dest_folder', file.name);
        await downloadFile(auth, file.id, filePath);
    }

    console.log('Sincronización completada.');
}

// Sincronizar al inicio
syncFolder();

// Sincronizar cada 10 minutos
setInterval(syncFolder, 10 * 60 * 1000);
