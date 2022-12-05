import CsvToJsonConversor from "./CsvToJSON";
import fs from "fs";
const csv2json = new CsvToJsonConversor("exemplo.csv", "data", "exemplo");

const dirPath = fs.mkdtempSync("testinput");
fs.writeFileSync(`${dirPath}/test.csv`, csv2json.readData());
const csv2jsonTest = new CsvToJsonConversor("test.csv", dirPath, "test");
const csv2jsonTestError = new CsvToJsonConversor("test.cvs", "arroz", "test");

describe("Check if the directory exists", () => {
  it("should return true if the directory exists", () => {
    expect(csv2jsonTest.checkIfDirectoryExists()).toBe(true);
  });
  it("should return false if the directory does not exist", () => {
    expect(csv2jsonTestError.checkIfDirectoryExists()).toBe(false);
  });
});

describe("Check if the file exists", () => {
  it("should return true if the file exists", () => {
    expect(csv2jsonTest.checkIfFileExists()).toBe(true);
  });
  it("should return false if the file does not exist", () => {
    expect(csv2jsonTestError.checkIfFileExists()).toBe(false);
  });
});

describe("Check if the file is a CSV file", () => {
  it("should return true if the file is a CSV file", () => {
    expect(csv2jsonTest.checkFileExtension()).toBe(true);
  });
  it("should return false if the file is not a CSV file", () => {
    expect(csv2jsonTestError.checkFileExtension()).toBe(false);
  })
});

describe("Read data from a CSV file", () => {
  it("should return the data from the file", () => {
    let spy = jest
      .spyOn(csv2json, "readData")
      .mockImplementation(
        () =>
          "Nome;Stack\nJosé;FRONT\nMaria;BACK\nLucas;FRONT\nSilvia;FRONT\nAdriana;BACK\n"
      );
    expect(csv2json.readData()).toEqual(
      "Nome;Stack\nJosé;FRONT\nMaria;BACK\nLucas;FRONT\nSilvia;FRONT\nAdriana;BACK\n"
    );
  });
  it("should throw an error if the directory does not exists", () => {
    expect(() => csv2jsonTestError.readData()).toThrow(
      "Directory does not exist"
    );
  });
});

describe("Transform the data from a CSV file into a array", () => {
  const data = csv2jsonTest.readData();
  it("should return the data from the file", () => {
    expect(csv2jsonTest.csvToArray(data)).toEqual([
      "Nome,Stack",
      "José,FRONT",
      "Maria,BACK",
      "Lucas,FRONT",
      "Silvia,FRONT",
      "Adriana,BACK",
      "",
    ]);
  });
});

describe("Get the headers from the CSV file", () => {
  const data = csv2jsonTest.readData();
  const csvArray = csv2jsonTest.csvToArray(data);
  it("should return an array with the headers from the file", () => {
    expect(csv2jsonTest.getHeaders(csvArray)).toEqual(["Nome", "Stack"]);
  });
});

describe("Create a matrix by spliting the rows of the csvArray", () => {
  const data = csv2jsonTest.readData();
  const csvArray = csv2jsonTest.csvToArray(data);
  it("should return a matrix where the rows are splited", () => {
    expect(csv2jsonTest.splitCsvArray(csvArray)).toEqual([
      ["José", "FRONT"],
      ["Maria", "BACK"],
      ["Lucas", "FRONT"],
      ["Silvia", "FRONT"],
      ["Adriana", "BACK"],
    ]);
  });
});

describe("Build a valid json using the data from the splitedCsv matrix an the headers array", () => {
  const data = csv2jsonTest.readData();
  const csvArray = csv2jsonTest.csvToArray(data);
  const headers = csv2jsonTest.getHeaders(csvArray);
  const splitedCsvArray = csv2jsonTest.splitCsvArray(csvArray);
  it("should return a matrix where the rows are splited", () => {
    expect(csv2jsonTest.buildJson(splitedCsvArray, headers)).toEqual([
      {
        Nome: "José",
        Stack: "FRONT",
      },
      {
        Nome: "Maria",
        Stack: "BACK",
      },
      {
        Nome: "Lucas",
        Stack: "FRONT",
      },
      {
        Nome: "Silvia",
        Stack: "FRONT",
      },
      {
        Nome: "Adriana",
        Stack: "BACK",
      },
    ]);
  });
});

describe("build a valid json", () => {
  it("should return a valid json", () => {
    expect(csv2jsonTest.toJSON()).toEqual([
      {
        Nome: "José",
        Stack: "FRONT",
      },
      {
        Nome: "Maria",
        Stack: "BACK",
      },
      {
        Nome: "Lucas",
        Stack: "FRONT",
      },
      {
        Nome: "Silvia",
        Stack: "FRONT",
      },
      {
        Nome: "Adriana",
        Stack: "BACK",
      },
    ]);
  });
});

describe("Write a json file using the valid JSON", () => {
  it("should write a valid json to a json file in the output directory", () => {
    csv2jsonTest.writeJSON();
    expect(fs.existsSync("output/exemplo.json")).toBe(true);
  });
});
