import CsvToJsonConversor from "./CsvToJSON";
const fs = require("fs");
fs.readdirSync("data").map((file: string) => {
  let csv2json = new CsvToJsonConversor(file, "data", file.replace(".csv", ""));
  csv2json.writeJSON();
});
