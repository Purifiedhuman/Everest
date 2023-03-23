import * as readline from "readline";
import * as fs from "fs";

import type { Vehicle } from "@/types/vehicle";
import type { Parcel, ReadParcelData, ReadParcelDataV2 } from "@/types/parcel";

export default class ReadFile {
  private _filePath: string;

  constructor(filePath: string) {
    this._filePath = filePath;
  }

  private processLineByLine(): Promise<string[]> {
    return new Promise((resolve) => {
      const fileStream = fs.createReadStream(this._filePath);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      const lines: string[] = [];

      rl.on("line", (line) => {
        // Each line in input.txt will be successively available here as `line`.
        lines.push(line);
      });

      rl.on("close", () => {
        resolve(lines);
      });
    });
  }

  public async readParcelData(): Promise<ReadParcelData> {
    const data = await this.processLineByLine();
    const header = data[0]; //First row is the header(Parcels Information)

    const headerRawData = header.split(" ");
    const [baseDeliveryCost, noOfParcels] = headerRawData;
    const parcelRawData = data.slice(1, parseInt(noOfParcels) + 1);

    const parcelData = parcelRawData.reduce((acc, curr) => {
      const [id, weightInKg, destinationDistanceInKm, discountCodeName] = curr.split(" ");
      return [
        ...acc,
        {
          id,
          weightInKg: parseInt(weightInKg),
          destinationDistanceInKm: parseInt(destinationDistanceInKm),
          discountCodeName,
        },
      ] as unknown as Parcel[] | [];
    }, []);

    return { baseDeliveryCost: parseInt(baseDeliveryCost), parcelData };
  }

  public async readParcelDataV2(): Promise<ReadParcelDataV2> {
    const data = await this.processLineByLine();
    const header = data[0]; //First row is the header(Parcels Information)

    const headerRawData = header.split(" ");
    const [baseDeliveryCost, noOfParcels] = headerRawData;
    const parcelRawData = data.slice(1, parseInt(noOfParcels) + 1);

    const parcelData = parcelRawData.reduce((acc, curr) => {
      const [id, weightInKg, destinationDistanceInKm, discountCodeName] = curr.split(" ");
      return [
        ...acc,
        {
          id,
          weightInKg: parseInt(weightInKg),
          destinationDistanceInKm: parseInt(destinationDistanceInKm),
          discountCodeName,
        },
      ] as unknown as Parcel[] | [];
    }, []);

    const footer = data[data.length - 1]; //Last row is the footer(Vehicle Information)
    const footerRawData = footer.split(" ");
    const [noOfVehicles, maxSpeedInKm, maxWeightInKg] = footerRawData;
    const vehicleData: Vehicle[] = [];

    for (let i = 0; i < parseInt(noOfVehicles); i++) {
      const vehicle = {
        id: i,
        maxSpeed: parseInt(maxSpeedInKm),
        maxWeight: parseInt(maxWeightInKg),
      };
      vehicleData.push(vehicle);
    }

    return { baseDeliveryCost: parseInt(baseDeliveryCost), parcelData, vehicleData };
  }
}
