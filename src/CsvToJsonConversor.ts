const fs = require("fs");
class CsvToJSON {
  constructor(private filename: string, private directoryName: string, private outputfilename: string) {}
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

  readData(): string {
    const repositoryExists = this.checkIfDirectoryExists();
    if (!repositoryExists) return "Directory does not exist";
    const fileExists = this.checkIfFileExists();
    if (!fileExists) return "File does not exist";
    return fs.readFileSync(`./data/${this.filename}`, "utf8");
  }

  //   validateFileData() {
  //     const data = this.readData();

  //   }

  csvToArray(data: string): string[] {
    return data.split("\n");
  }

  getHeaders(csvArray: string[]): string[] {
    return csvArray[0].split(",");
  }

  splitCsvArray(csvArray: string[]): string[][] {
    const splitedCsvArray = [];
    for (let i = 1; i < csvArray.length - 1; i++) {
      splitedCsvArray.push(csvArray[i].split(","));
    }
    return splitedCsvArray;
  }

  buildJson(splitedCsvArray: string[][], headers: string[]): any[] {
    const json = [];
    for (let row of splitedCsvArray) {
      const newRow: any = {};
      for (let i = 0; i < headers.length; i++) {
        newRow[headers[i]] = row[i];
      }
      json.push(newRow);
    }
    return json;
  }

  toJSON(): string[] {
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

  writeJSON(): void {
    const json = this.toJSON();
    if (fs.existsSync("output")) {
      fs.writeFileSync(`./output/${this.outputfilename}.json`, JSON.stringify(json));
    } else {
      fs.mkdirSync("output");
      fs.writeFileSync(`./output/${this.outputfilename}.json`, JSON.stringify(json));
    }
  }
}

const csvToJSON = new CsvToJSON("exemplo.csv", "data", "candidatos");
const json = csvToJSON.toJSON();
csvToJSON.writeJSON();
