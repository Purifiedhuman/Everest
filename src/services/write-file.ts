import * as fsPromise from "fs/promises";
import * as fs from "fs";

import type { Parcel } from "@/types/parcel";

export default class WriteFile {
  private _filePath: string;

  constructor(filePath: string) {
    this._filePath = filePath;
  }

  public async writeParcelData(parcelData: Parcel[]): Promise<void> {
    try {
      //Check if file exists
      if (!fs.existsSync(this._filePath)) {
        await fsPromise.writeFile(this._filePath, "");
      }
      //Clear the file before writing to it
      await fsPromise.truncate(this._filePath, 0);
      for (let i = 0; i < parcelData.length; i++) {
        const content = `${parcelData[i].id} ${parcelData[i].discountedAmount} ${parcelData[i].discountedCost}\n`;
        await fsPromise.appendFile(this._filePath, content);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async writeParcelDataWithDelivery(parcelData: Parcel[]): Promise<void> {
    try {
      //Check if file exists
      if (!fs.existsSync(this._filePath)) {
        await fsPromise.writeFile(this._filePath, "");
      }
      //Clear the file before writing to it
      await fsPromise.truncate(this._filePath, 0);
      for (let i = 0; i < parcelData.length; i++) {
        const content = `${parcelData[i].id} ${parcelData[i].discountedAmount} ${parcelData[i].discountedCost} ${parcelData[i].deliveryTimeInHours}\n`;
        await fsPromise.appendFile(this._filePath, content);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
