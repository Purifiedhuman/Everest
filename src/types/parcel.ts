export type Parcel = {
  id: number;
  weightInKg: number;
  destinationDistanceInKm: number;
  discountCodeName: string | null;
  totalCost?: number;
  discountedAmount?: number;
  discountedCost?: number;
};

export type ReadParcelData = {
  baseDeliveryCost: number;
  parcelData: Parcel[];
};
