import type { Vehicle } from "./vehicle";

export type Parcel = {
  id: string;
  weightInKg: number;
  destinationDistanceInKm: number;
  discountCodeName: string | null;
  totalCost?: number;
  discountedAmount?: number;
  discountedCost?: number;
  deliveryTimeInHours?: number;
};

export type ReadParcelData = {
  baseDeliveryCost: number;
  parcelData: Parcel[];
};

export type ReadParcelDataV2 = ReadParcelData & {
  vehicleData: Vehicle[];
};
