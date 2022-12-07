import CsvToJsonConversor from "./CsvToJSON";
import fs from "fs";
fs.readdirSync("data").forEach((file: string) => {
  let csv2json = new CsvToJsonConversor(file, "data", file.replace(".csv", ""));
  csv2json.writeJSON();
});
