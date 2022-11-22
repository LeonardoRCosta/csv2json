"use strict";
const fs = require("fs");
class CsvToJSON {
    constructor(filename, directoryName, outputfilename) {
        this.filename = filename;
        this.directoryName = directoryName;
        this.outputfilename = outputfilename;
    }
    checkIfDirectoryExists() {
        if (!fs.existsSync(this.directoryName)) {
            return false;
        }
        return true;
    }
    checkIfFileExists() {
        if (!fs.existsSync(`./${this.directoryName}/${this.filename}`)) {
            return false;
        }
        return true;
    }
    readData() {
        const repositoryExists = this.checkIfDirectoryExists();
        if (!repositoryExists)
            return "Directory does not exist";
        const fileExists = this.checkIfFileExists();
        if (!fileExists)
            return "File does not exist";
        return fs.readFileSync(`./data/${this.filename}`, "utf8");
    }
    //   validateFileData() {
    //     const data = this.readData();
    //   }
    csvToArray(data) {
        return data.split("\n");
    }
    getHeaders(csvArray) {
        return csvArray[0].split(",");
    }
    splitCsvArray(csvArray) {
        const splitedCsvArray = [];
        for (let i = 1; i < csvArray.length - 1; i++) {
            splitedCsvArray.push(csvArray[i].split(","));
        }
        return splitedCsvArray;
    }
    buildJson(splitedCsvArray, headers) {
        const json = [];
        for (let row of splitedCsvArray) {
            const newRow = {};
            for (let i = 0; i < headers.length; i++) {
                newRow[headers[i]] = row[i];
            }
            json.push(newRow);
        }
        return json;
    }
    toJSON() {
        const data = this.readData();
        const csvArray = this.csvToArray(data);
        const headers = this.getHeaders(csvArray);
        const splitedCsvArray = this.splitCsvArray(csvArray);
        const json = this.buildJson(splitedCsvArray, headers);
        console.log(headers);
        console.log(csvArray);
        console.log(splitedCsvArray);
        console.log(json);
        return json;
    }
    writeJSON() {
        const json = this.toJSON();
        if (fs.existsSync("output")) {
            fs.writeFileSync(`./output/${this.outputfilename}.json`, JSON.stringify(json));
        }
        else {
            fs.mkdirSync("output");
            fs.writeFileSync(`./output/${this.outputfilename}.json`, JSON.stringify(json));
        }
    }
}
const csvToJSON = new CsvToJSON("exemplo.csv", "data", "candidatos");
const json = csvToJSON.toJSON();
csvToJSON.writeJSON();
