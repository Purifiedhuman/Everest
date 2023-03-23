import { calculateDeliveryTime, calculateTotalCost } from "./services/parcel-service";
import ReadFile from "./services/read-file";
import WriteFile from "./services/write-file";

async function main(): Promise<void> {
  const readFile = new ReadFile("input.txt");
  const data = await readFile.readParcelDataV2();

  calculateTotalCost(data);
  const calculatedDeliveryTime = calculateDeliveryTime(data);

  const writeFile = new WriteFile("output.txt");
  writeFile.writeParcelDataWithDelivery(calculatedDeliveryTime);
}

main();
