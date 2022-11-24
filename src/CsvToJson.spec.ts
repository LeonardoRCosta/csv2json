import CsvToJsonConversor from "./CsvToJsonConversor";
const fs = require("fs");
const csv2json = new CsvToJsonConversor("exemplo.csv", "data", "exemplo");

describe("Check if the directory exists", () => {
  it("should return true if the directory exists", () => {
    expect(csv2json.checkIfDirectoryExists()).toBe(true);
  });
});

describe("Check if the file exists", () => {
  it("should return true if the file exists", () => {
    expect(csv2json.checkIfFileExists()).toBe(true);
  });
});

describe("Check if the file is a CSV file", () => {
  it("should return true if the file is a CSV file", () => {
    expect(csv2json.checkFileExtension()).toBe(true);
  });
});

describe("Read data from a CSV file", () => {
  it("should return the data from the file", () => {
    expect(csv2json.readData()).toEqual(
      "Nome;Stack\nJosé;FRONT\nMaria;BACK\nLucas;FRONT\nSilvia;FRONT\nAdriana;BACK\n"
    );
  });
});

describe("Transform the data from a CSV file into a array", () => {
  const data = csv2json.readData();
  it("should return the data from the file", () => {
    expect(csv2json.csvToArray(data)).toEqual([
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
  const data = csv2json.readData();
  const csvArray = csv2json.csvToArray(data);
  it("should return an array with the headers from the file", () => {
    expect(csv2json.getHeaders(csvArray)).toEqual(["Nome", "Stack"]);
  });
});

describe("Create a matrix by spliting the rows of the csvArray", () => {
  const data = csv2json.readData();
  const csvArray = csv2json.csvToArray(data);
  it("should return a matrix where the rows are splited", () => {
    expect(csv2json.splitCsvArray(csvArray)).toEqual([
      ["José", "FRONT"],
      ["Maria", "BACK"],
      ["Lucas", "FRONT"],
      ["Silvia", "FRONT"],
      ["Adriana", "BACK"],
    ]);
  });
});

describe("Build a valid json using the data from the splitedCsv matrix an the headers array", () => {
  const data = csv2json.readData();
  const csvArray = csv2json.csvToArray(data);
  const headers = csv2json.getHeaders(csvArray);
  const splitedCsvArray = csv2json.splitCsvArray(csvArray);
  it("should return a matrix where the rows are splited", () => {
    expect(csv2json.buildJson(splitedCsvArray, headers)).toEqual([
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
    expect(csv2json.toJSON()).toEqual([
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
    csv2json.writeJSON();
    expect(fs.existsSync("output/exemplo.json")).toBe(true);
  });
});
