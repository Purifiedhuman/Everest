import { beforeEach, describe, expect, test } from "vitest";

import { calculateTotalCost, validateMatchingDiscountCode } from "@/services/parcel-service";

import { MOCK_BASE_READ_PARCEL_DATA, MOCK_PARCELS_WITH_CALCULATED_COST } from "../fixtures/parcels";

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
  test<ParcelDeliveryTimeEstimationContext>("findBestParcelsCombination should return best combination with lowest distance", ({
    parcelData,
  }) => {
    console.log(parcelData);
  });

  test<ParcelDeliveryTimeEstimationContext>("calculateDeliveryTime should return correct delivery time.", ({
    parcelData,
  }) => {});
});
