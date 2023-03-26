import path from "path";

import { calculateTotalCost } from "./services/parcel-service";
import ReadFile from "./services/read-file";
import WriteFile from "./services/write-file";

async function main(): Promise<void> {
  const inputFilePath = path.join(__dirname, "./files/delivery-cost-files/input.txt");
  const readFile = new ReadFile(inputFilePath);
  const data = await readFile.readParcelData();

  const calculatedData = calculateTotalCost(data);

  const outputFilePath = path.join(__dirname, "./files/delivery-cost-files/output.txt");
  const writeFile = new WriteFile(outputFilePath);
  writeFile.writeParcelData(calculatedData);
}

main();
