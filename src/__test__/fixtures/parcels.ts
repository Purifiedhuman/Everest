import type { ReadParcelData } from "@/types/parcel";

export const MOCK_BASE_READ_PARCEL_DATA: ReadParcelData = {
  baseDeliveryCost: 100,
  parcelData: [
    {
      id: "PKG1",
      weightInKg: 5,
      destinationDistanceInKm: 5,
      discountCodeName: "OFR001",
    },
    {
      id: "PKG2",
      weightInKg: 15,
      destinationDistanceInKm: 5,
      discountCodeName: "OFR002",
    },
    {
      id: "PKG3",
      weightInKg: 10,
      destinationDistanceInKm: 100,
      discountCodeName: "OFR003",
    },
  ],
};

export const MOCK_PARCELS_WITH_CALCULATED_COST = [
  {
    id: "PKG1",
    weightInKg: 5,
    destinationDistanceInKm: 5,
    discountCodeName: null,
    totalCost: 175,
    discountedAmount: 0,
    discountedCost: 175,
  },
  {
    id: "PKG2",
    weightInKg: 15,
    destinationDistanceInKm: 5,
    discountCodeName: null,
    totalCost: 275,
    discountedAmount: 0,
    discountedCost: 275,
  },
  {
    id: "PKG3",
    weightInKg: 10,
    destinationDistanceInKm: 100,
    discountCodeName: "OFR003",
    totalCost: 700,
    discountedAmount: 35,
    discountedCost: 665,
  },
];
