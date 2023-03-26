import path from "path";

import { calculateDeliveryTime, calculateTotalCost } from "./services/parcel-service";
import ReadFile from "./services/read-file";
import WriteFile from "./services/write-file";

async function main(): Promise<void> {
  const inputFilePath = path.join(__dirname, "./files/delivery-time-files/input.txt");
  const readFile = new ReadFile(inputFilePath);
  const data = await readFile.readParcelDataV2();

  calculateTotalCost(data);
  const calculatedDeliveryTime = calculateDeliveryTime(data);

  const outputFilePath = path.join(__dirname, "./files/delivery-time-files/output.txt");
  const writeFile = new WriteFile(outputFilePath);
  writeFile.writeParcelDataWithDelivery(calculatedDeliveryTime);
}

main();
