import { beforeEach, describe, expect, test } from "vitest";

import {
  calculateDeliveryTime,
  calculateTotalCost,
  validateMatchingDiscountCode,
  findBestParcelsCombination,
} from "@/services/parcel-service";

import {
  MOCK_BASE_READ_PARCEL_DATA,
  MOCK_BASE_READ_PARCEL_DATA_V2,
  MOCK_PARCELS_WITH_CALCULATED_COST,
} from "../fixtures/parcels";

import type { ProcessingParcelData } from "@/services/parcel-service";
import type { ReadParcelData, ReadParcelDataV2 } from "@/types/parcel";

type ParcelServiceCostEstimationContext = {
  parcelData: ReadParcelData;
};

type ParcelDeliveryTimeEstimationContext = {
  parcelData: ReadParcelDataV2;
};

describe("Parcel Service For Cost Estimation", () => {
  beforeEach<ParcelServiceCostEstimationContext>(async (context) => {
    context.parcelData = MOCK_BASE_READ_PARCEL_DATA;
  });

  test("validateMatchingDiscountCode should not remove valid discount code.", () => {
    const validatedParcel = validateMatchingDiscountCode({
      id: "PKG1",
      weightInKg: 15,
      destinationDistanceInKm: 100,
      discountCodeName: "OFR003",
    });
    expect(validatedParcel.discountCodeName).toBe("OFR003");
  });

  test("validateMatchingDiscountCode should remove invalid discount code.", () => {
    const validatedParcel = validateMatchingDiscountCode({
      id: "PKG1",
      weightInKg: 5,
      destinationDistanceInKm: 5,
      discountCodeName: "OFR001",
    });
    expect(validatedParcel.discountCodeName).toBe(null);
  });

  test<ParcelServiceCostEstimationContext>("calculateTotalCost should return correct total cost.", ({ parcelData }) => {
    const parcelDataWithTotalCost = calculateTotalCost(parcelData);
    expect(parcelDataWithTotalCost).toStrictEqual(MOCK_PARCELS_WITH_CALCULATED_COST);
  });
});

describe("Parcel Service For Delivery Time Estimation", () => {
  beforeEach<ParcelServiceCostEstimationContext>(async (context) => {
    context.parcelData = MOCK_BASE_READ_PARCEL_DATA_V2;
  });

  test("findBestParcelsCombination should return best combination with lowest distance", () => {
    const mockCombinationData: ProcessingParcelData[] = [
      {
        id: "PKG1",
        weightInKg: 75,
        destinationDistanceInKm: 20,
        discountCodeName: null,
        totalCost: 1475,
        discountedAmount: 0,
        discountedCost: 1475,
        status: "undelivered",
      },
      {
        id: "PKG2",
        weightInKg: 110,
        destinationDistanceInKm: 40,
        discountCodeName: "OFR002",
        totalCost: 1500,
        discountedAmount: 105,
        discountedCost: 1395,
        status: "undelivered",
      },
      {
        id: "PKG3",
        weightInKg: 185,
        destinationDistanceInKm: 30,
        discountCodeName: "OFR002",
        totalCost: 1500,
        discountedAmount: 105,
        discountedCost: 1395,
        status: "undelivered",
      },
    ];

    const bestCombination = findBestParcelsCombination(mockCombinationData, 200);
    expect(bestCombination).toContain(mockCombinationData[2]);
  });

  test<ParcelDeliveryTimeEstimationContext>("calculateDeliveryTime should return correct delivery time.", ({
    parcelData,
  }) => {
    const parcelDataWithDeliveryTime = calculateDeliveryTime(parcelData);
    expect(parcelDataWithDeliveryTime[0].deliveryTimeInHours).toBe(3.98);
    expect(parcelDataWithDeliveryTime[1].deliveryTimeInHours).toBe(1.78);
    expect(parcelDataWithDeliveryTime[2].deliveryTimeInHours).toBe(1.42);
    expect(parcelDataWithDeliveryTime[3].deliveryTimeInHours).toBe(0.85);
    expect(parcelDataWithDeliveryTime[4].deliveryTimeInHours).toBe(4.19);
  });
});
