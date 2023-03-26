import type { Parcel, ReadParcelData, ReadParcelDataV2 } from "@/types/parcel";

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

export const MOCK_BASE_READ_PARCEL_DATA_V2: ReadParcelDataV2 = {
  baseDeliveryCost: 100,
  parcelData: [
    {
      id: "PKG1",
      weightInKg: 50,
      destinationDistanceInKm: 30,
      discountCodeName: null,
      totalCost: 750,
      discountedAmount: 0,
      discountedCost: 750,
    },
    {
      id: "PKG2",
      weightInKg: 75,
      destinationDistanceInKm: 125,
      discountCodeName: null,
      totalCost: 1475,
      discountedAmount: 0,
      discountedCost: 1475,
    },
    {
      id: "PKG3",
      weightInKg: 175,
      destinationDistanceInKm: 100,
      discountCodeName: null,
      totalCost: 2350,
      discountedAmount: 0,
      discountedCost: 2350,
    },
    {
      id: "PKG4",
      weightInKg: 110,
      destinationDistanceInKm: 60,
      discountCodeName: "OFR002",
      totalCost: 1500,
      discountedAmount: 105,
      discountedCost: 1395,
    },
    {
      id: "PKG5",
      weightInKg: 155,
      destinationDistanceInKm: 95,
      discountCodeName: null,
      totalCost: 2125,
      discountedAmount: 0,
      discountedCost: 2125,
    },
  ],
  vehicleData: [
    { id: 0, maxSpeed: 70, maxWeight: 200 },
    { id: 1, maxSpeed: 70, maxWeight: 200 },
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
