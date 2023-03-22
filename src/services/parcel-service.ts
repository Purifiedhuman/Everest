import { DISCOUNT_MOCK_DATA } from "../constants/discount-mock-data";

import type { Parcel, ReadParcelData } from "@/types/parcel";

const WEIGHT_COST = 10;
const DISTANCE_COST = 5;

export function calculateTotalCost(readParcelData: ReadParcelData): Parcel[] {
  readParcelData.parcelData.forEach((parcel) => {
    const validatedParcel = validateMatchingDiscountCode(parcel);
    const deliveryCost =
      readParcelData.baseDeliveryCost +
      validatedParcel.weightInKg * WEIGHT_COST +
      validatedParcel.destinationDistanceInKm * DISTANCE_COST;
    let discountedAmount = 0;
    let discountedCost = deliveryCost;

    if (validatedParcel.discountCodeName) {
      const matchingDiscount = DISCOUNT_MOCK_DATA.find(
        (discount) => discount.codeName === validatedParcel.discountCodeName,
      );

      discountedAmount = deliveryCost * matchingDiscount!.percentage;
      discountedCost = deliveryCost - discountedAmount;
    }

    parcel.totalCost = deliveryCost;
    parcel.discountedAmount = discountedAmount;
    parcel.discountedCost = discountedCost;
  });

  return readParcelData.parcelData;
}

function validateMatchingDiscountCode(parcel: Parcel): Parcel {
  const matchingDiscount = DISCOUNT_MOCK_DATA.find((discount) => {
    const isMatchingCode = discount.codeName === parcel.discountCodeName;
    const isMatchingDistance =
      parcel.destinationDistanceInKm >= discount.minDistance && parcel.destinationDistanceInKm <= discount.maxDistance;
    const isMatchingWeight = parcel.weightInKg >= discount.minWeight && parcel.weightInKg <= discount.maxWeight;

    return isMatchingCode && isMatchingDistance && isMatchingWeight;
  });

  if (!matchingDiscount) {
    parcel.discountCodeName = null;
  }

  return parcel;
}
