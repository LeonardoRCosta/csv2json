import fs from "fs";
type JsonProps = Record<string, unknown>;
/**
 * Class that converts a CSV file into a JSON file
 *
 * @constructor
 * filename: a string representing the filename of the CSV file and its extension
 * directoryName: a string representing the name of the directory that contains the CSV file
 * outputfilename: a string representing the name of the output file
 *
 * @author: Leonardo Ramos Costa
 */
export default class CsvToJSON {
  constructor(
    private filename: string,
    private directoryName: string,
    private outputfilename: string
  ) {}
  /**
   * This method checks if the directory passed into the constructor exists
   * @return true if the directory exists and false otherwise
   */
  checkIfDirectoryExists(): boolean {
    const directoryExists = fs.existsSync(this.directoryName);
    if (!directoryExists) return false;

    return true;
  }

  /**
   * This method checks if the file passed into the constructor exists
   * @return true if the file exists and false otherwise
   */
  checkIfFileExists(): boolean {
    const fileExists = fs.existsSync(
      `./${this.directoryName}/${this.filename}`
    );
    if (!fileExists) return false;

    return true;
  }

  /**
   * This method checks if the file extension is .csv
   * @return true if the file extension is .csv and false otherwise
   */
  checkFileExtension(): boolean {
    const fileExtension = this.filename.slice(this.filename.length - 4);

    const isFileCsv = fileExtension === ".csv";
    if (!isFileCsv) return false;

    return true;
  }

  /**
   * This method read the data from the csv file
   * @returns the data from the csv file
   */
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

  /**
   * This method transforms the data of a csv file into an array of strings
   * @param data The string containing the data of the csv file
   * @returns an array of strings containing the data of the csv file
   */
  csvToArray(data: string): string[] {
    const isSemicolonSeparated = data.includes(";")
    if (!isSemicolonSeparated) return data.split("\n");

    for (let i = 0; i < data.length; i++) {
      data = data.replace(";", ",");
    }
    return data.split("\n");
  }

  /**
   * This method colects the headers of the csvArray and pushes them into the headers array
   * @param csvArray Array of strings containing the data of the csv file
   * @returns Array containing the headers of the csv
   */
  getHeaders(csvArray: string[]): string[] {
    return csvArray[0].split(",");
  }

  /**
   * This method transforms the elements of the csvArray into an matrix of strings
   * @param csvArray
   * @returns Matrix of strings containing the data of the csv
   */
  splitCsvArray(csvArray: string[]): string[][] {
    csvArray.shift();
    const splitedCsvArray: string[][] = csvArray.map((row) => row.split(","));
    splitedCsvArray.pop();

    return splitedCsvArray;
  }

  /**
   * This method uses the matrix of strings and the headers array to create a valid json
   * @param splitedCsvArray Matrix of strings containing the data of the csv
   * @param headers Array containing the headers of the csv
   * @returns an array of objects representing a valid json
   */
  buildJson(splitedCsvArray: string[][], headers: string[]): JsonProps[] {
    const json = splitedCsvArray.reduce((acc: JsonProps[], row) => {
      const jsonObject = row.reduce((acc: JsonProps, data, i) => {
        acc[headers[i]] = data;
        return acc;
      }, {})
      return [...acc, jsonObject];
    }, [])
    return json;
  }

  /**
   * This method calls the other methods to build the valid json and return it
   * @returns an array of objects representing a valid json
   */
  toJSON(): JsonProps[] {
    const data = this.readData();
    const csvArray = this.csvToArray(data);
    const headers = this.getHeaders(csvArray);
    const splitedCsvArray = this.splitCsvArray(csvArray);
    const json = this.buildJson(splitedCsvArray, headers);
    return json;
  }

  /**
   * This method calls the toJSON method and write the data to a JSON file
   * @return void
   */
  writeJSON(): void {
    const json = this.toJSON();

    const outputRepositoryExists = fs.existsSync("output") 
    if (!outputRepositoryExists) {
      fs.mkdirSync("output");
      
      fs.writeFileSync(
        `./output/${this.outputfilename}.json`,
        JSON.stringify(json, null, 2)
      );
    }
    fs.writeFileSync(
      `./output/${this.outputfilename}.json`,
      JSON.stringify(json, null, 2)
    );
  }
}
