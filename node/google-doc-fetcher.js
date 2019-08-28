const fetch = require('node-fetch');
const fs = require('fs');
const FORMATS = {
    'document' : 'txt',
    'spreadsheets' : 'xlsx'
};

const DOC_REGEX = /https:\/\/docs.google.com\/(.*)\/d\/(.*)\//;

function parseGoogleDocUrl(inputUrl) {
    const parts = inputUrl.match(DOC_REGEX);

    if (!parts) {
        throw new Error("Invalid or unsupported URL");
    }

    return {
        id : parts[2],
        type : parts[1],
        url : parts[0]
    };
}

class GoogleDocFetcher {
    constructor(url) {
        console.log(`Fetching <${url}>`);

        const opts = parseGoogleDocUrl(url);

        if (opts.type in FORMATS) {
            opts.format = FORMATS[opts.type];
        } else {
            throw new Error(`Invalid type: ${type}`);
        }

        console.log(opts);

        Object.assign(this, opts);
    }

    async writeTo(path) {
        const url = `https://docs.google.com/${this.type}/d/${this.id}/export?format=${this.format}`;
        console.log(`Fetching ${url}`);
        const req = await fetch(url);

        if (req.status !== 200) {
            console.error(`Error: ${req.status}`);
        } else {
            console.log(`Got the data, now writing to file`);
        }

        const dest = fs.createWriteStream(path);

        return new Promise((resolve) => {
            const stream = req.body.pipe(dest);
            stream.on('finish', () => {
                console.log('Done writing');
                resolve();
            });
        });
    }
}

module.exports = GoogleDocFetcher;