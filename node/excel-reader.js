const excelReader = require('read-excel-file/node');
const fs = require('fs').promises;

// I'm sure Lodash has a handier method for this that i don't understand,
// fromPairs() doesn't work as expected
function arrayToObject(keys, values) {
    const object = {};

    keys.forEach((key, index) => {
        object[key] = values[index];
    });

    return object;
}

class ExcelReader {
    constructor(path) {
        this.path = path;
        console.log(`Processing ${this.path}`);
    }

    async getSheetData(sheetName) {
        const returnData = [];
        const rows = await excelReader(this.path, { sheet : sheetName });
        console.log(`Got ${rows.length} rows for sheet ${sheetName}`);
        let header = null;

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];

            if (index === 0) {
                // Header
                header = row;
                console.log(`Header: ${header}`);
            } else {
                returnData.push(arrayToObject(header, row));
            }
        }

        return returnData;
    }

    async getData() {
        const data = {};
        const sheets = await excelReader(this.path, { getSheets : true});
        const sheetNames = sheets.map(s => s.name);
        console.log(`Got sheetnames: ${sheetNames}`);

        for (const sheetName of sheetNames) {
            const rows = await this.getSheetData(sheetName);
            data[sheetName] = rows;
        }

        return data;
    }
}

module.exports = ExcelReader;