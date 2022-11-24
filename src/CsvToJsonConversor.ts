const fs = require("fs");
export default class CsvToJSON {
  constructor(
    private filename: string,
    private directoryName: string,
    private outputfilename: string
  ) {}
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

  checkFileExtension() {
    if(this.filename.includes(".csv")) return true;
    return false;
  }

  readData(): string {
    try {
      const repositoryExists = this.checkIfDirectoryExists();
      if (!repositoryExists) throw new Error("Directory does not exist");
      const fileExists = this.checkIfFileExists();
      if (!fileExists) throw new Error("File does not exist");
      const isFileCsv = this.checkFileExtension();
      if (!isFileCsv) throw new Error("File is not a CSV");
      return fs.readFileSync(`./data/${this.filename}`, "utf8");
    } catch (error: any) {
      throw error.message;
    }
  }

  csvToArray(data: string): string[] {
    if (data.includes(";")) {
      for (let i = 0; i < data.length; i++) {
        data = data.replace(";", ",")
      }
    }
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
    return json;
  }

  writeJSON(): void {
    const json = this.toJSON();
    if (fs.existsSync("output")) {
      fs.writeFileSync(
        `./output/${this.outputfilename}.json`,
        JSON.stringify(json, null, 2)
      );
    } else {
      fs.mkdirSync("output");
      fs.writeFileSync(
        `./output/${this.outputfilename}.json`,
        JSON.stringify(json)
      );
    }
  }
}
