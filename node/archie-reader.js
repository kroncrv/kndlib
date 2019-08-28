const archieml = require('archieml');
const fs = require('fs').promises;
const { mapKeys, pickBy } = require('lodash');

const DEFAULT_OPTS = {
    prefix : null,
    lowercaseAll : false
}

class ArchieReader {
    constructor(path, opts = DEFAULT_OPTS) {
        this.path = path;
        this.prefix = opts.prefix;
        this.lowercaseAll = opts.lowercaseAll;

        console.log(`Processing ${this.path} with options ${JSON.stringify(opts)}`);
    }

    async getData() {
        const data = await fs.readFile(this.path, 'utf-8');
        let parsed = archieml.load(data);

        if (this.lowercaseAll) {
            parsed = mapKeys(parsed, (v, k) => k.toLowerCase());
        }

        if (this.prefix) {
            parsed = pickBy(parsed, (v, k) => k.startsWith(this.prefix));
        }

        console.log(`Got an object with ${Object.keys(parsed).length} keys`);

        return parsed;
    }
}

module.exports = ArchieReader;