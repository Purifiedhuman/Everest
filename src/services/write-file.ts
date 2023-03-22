import * as fs from "fs/promises";

import type { Parcel } from "@/types/parcel";

export default class WriteFile {
  private _filePath: string;

  constructor(filePath: string) {
    this._filePath = filePath;
  }

  public async writeParcelData(parcelData: Parcel[]): Promise<void> {
    try {
      //Clear the file before writing to it
      await fs.truncate(this._filePath, 0);
      for (let i = 0; i < parcelData.length; i++) {
        const content = `${parcelData[i].id} ${parcelData[i].discountedAmount} ${parcelData[i].discountedCost}\n`;
        await fs.appendFile(this._filePath, content);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
