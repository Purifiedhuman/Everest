import { BigNumber } from "bignumber.js";

import { roundDownToDecimalPlaces } from "../helpers/utils";
import { DISCOUNT_MOCK_DATA } from "../constants/discount-mock-data";

import type { Vehicle } from "@/types/vehicle";
import type { Parcel, ReadParcelData, ReadParcelDataV2 } from "@/types/parcel";

const WEIGHT_COST = 10;
const DISTANCE_COST = 5;

export type ProcessingParcelData = Parcel & {
  status: "undelivered" | "delivering" | "delivered";
};

export type ProcessingVehicleData = Vehicle & {
  status: "available" | "unavailable";
  availableIn: number;
  deliveringParcels: ProcessingParcelData[];
};

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
    parcel.discountedAmount = roundDownToDecimalPlaces(discountedAmount, 2);
    parcel.discountedCost = discountedCost;
  });

  return readParcelData.parcelData;
}

export function validateMatchingDiscountCode(parcel: Parcel): Parcel {
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

export function calculateDeliveryTime(readParcelDataV2: ReadParcelDataV2): Parcel[] {
  const { parcelData, vehicleData } = readParcelDataV2;
  // Roundoff estimated delivery time up to 2 digits
  // Shipment should contain max packages vehicle can carry in one trip
  // Should prefer heavy packages first if there are multiple packages with same no. of packages
  // If weights are the same, prefererence should be given to the shipment which can be delivered first

  if (vehicleData.length === 0) {
    return parcelData;
  }

  //All vehicles are the identical, so we can just use the first vehicle to get the max weight and speed
  const vehicleMaxWeight = vehicleData[0].maxWeight;
  const vehicleMaxSpeed = vehicleData[0].maxSpeed;

  const processingParcelData = parcelData.reduce<ProcessingParcelData[]>((accum, currParcel) => {
    return [
      ...accum,
      {
        ...currParcel,
        status: "undelivered",
      },
    ];
  }, []);

  const processingVehicleData = vehicleData.reduce<ProcessingVehicleData[]>((accum, currVehicle) => {
    return [
      ...accum,
      {
        ...currVehicle,
        status: "available",
        availableIn: 0,
        deliveringParcels: [],
      },
    ];
  }, []);

  let currentTime = 0;
  // const loopLimit = 0; //For testing purposes
  // Loop until all parcels are delivered
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (processingParcelData.every((parcel) => parcel.status === "delivered")) {
      break;
    }

    const undeliveredParcels = processingParcelData.filter((parcel) => parcel.status === "undelivered");
    //This returns a copy not a reference
    const heaviestCombineParcels = findBestParcelsCombination(undeliveredParcels, vehicleMaxWeight);
    const availableVehicle = processingVehicleData.find((vehicle) => vehicle.status === "available");

    //No available vehicle or no more parcels to deliver, progresses time updated all related vehicle and parcel information to the current time
    if (!availableVehicle || undeliveredParcels.length === 0) {
      const shortestDeliveryTime = BigNumber(
        Math.min(...processingVehicleData.map((vehicle) => vehicle.availableIn)),
      ).toNumber();

      currentTime = BigNumber(currentTime).plus(shortestDeliveryTime).toNumber();

      //update vehicle status and parcel status FOR CURRENT TIME PASSED
      processingVehicleData.forEach((vehicle) => {
        if (BigNumber(vehicle.availableIn).isEqualTo(shortestDeliveryTime)) {
          vehicle.status = "available";
          vehicle.deliveringParcels.forEach((parcel) => {
            parcel.status = "delivered";
          });
          vehicle.deliveringParcels = [];
        }
        vehicle.availableIn = roundDownToDecimalPlaces(Math.max(vehicle.availableIn - currentTime, 0), 2);
      });

      continue;
    }

    // Import parcels into vehicle
    availableVehicle.status = "unavailable";

    //Get reference to the parcels in the processingParcelData array
    const parcelsToDeliver = processingParcelData.filter((parcel) => heaviestCombineParcels.includes(parcel));
    parcelsToDeliver.forEach((parcel) => {
      parcel.status = "delivering";
    });

    availableVehicle.deliveringParcels = parcelsToDeliver;

    //Calculate delivery time
    const deliveryTimeInHours = calculateDeliveryTimeInHours(currentTime, parcelsToDeliver, vehicleMaxSpeed);
    availableVehicle.availableIn = currentTime + deliveryTimeInHours * 2;
  }

  return processingParcelData;
}

//Knapsack Problem resolve using dynamic programming with memoization (https://www.youtube.com/watch?v=xOlhR_2QCXY)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function findMaxWeight(parcelData: ProcessingParcelData[], vehicleMaxWeight: number): number {
  const cache: number[][] = [[]]; //arr[index][capacity]

  //Start from the last parcel and work backwards
  return recurse(parcelData.length - 1, vehicleMaxWeight);

  function recurse(index: number, maxWeight: number): number {
    //Check if we have already calculated this
    if (cache[index] && cache[index][maxWeight] != null) {
      return cache[index][maxWeight];
    }

    let result = 0;
    //Base case, if we have no parcels or no maxWeight left we're done with this branch
    if (index < 0 || maxWeight === 0) {
      result = 0;
    } else if (parcelData[index].weightInKg > maxWeight) {
      //If current parcel is too heavy, skip it and move on to the next one
      result = recurse(index - 1, maxWeight);
    } else {
      const currentWeight = parcelData[index].weightInKg;

      //We have two options, take the current parcel or skip it
      const skipCurrentParcel = recurse(index - 1, maxWeight);
      const takeCurrentParcel = currentWeight + recurse(index - 1, maxWeight - currentWeight);

      result = Math.max(takeCurrentParcel, skipCurrentParcel);
    }

    //Store result in cache
    cache[index] = cache[index] || [];
    cache[index][maxWeight] = result;

    return result;
  }
}

//Knapsack Problem resolve using dynamic programming with memoization (https://www.youtube.com/watch?v=xOlhR_2QCXY)
export function findBestParcelsCombination(
  parcelData: ProcessingParcelData[],
  vehicleMaxWeight: number,
): ProcessingParcelData[] {
  const cache: ProcessingParcelData[][][] = [[[]]]; //arr[index][capacity][Parcel[]]

  //Start from the last parcel and work backwards
  return recurse(parcelData.length - 1, vehicleMaxWeight);

  function recurse(index: number, maxWeight: number): ProcessingParcelData[] {
    //Check if we have already calculated this
    if (cache[index] && cache[index][maxWeight] != null) {
      return cache[index][maxWeight];
    }

    let result: ProcessingParcelData[] = [];
    //Base case, if we have no parcels or no maxWeight left we're done with this branch
    if (index < 0 || maxWeight === 0) {
      result = [];
    } else if (parcelData[index].weightInKg > maxWeight) {
      //If current parcel is too heavy, skip it and move on to the next one
      result = recurse(index - 1, maxWeight);
    } else {
      const currentWeight = parcelData[index].weightInKg;

      //We have two options, take the current parcel or skip it
      const takeCurrentParcel = [...recurse(index - 1, maxWeight - currentWeight), parcelData[index]];
      const skipCurrentParcel = recurse(index - 1, maxWeight);

      const takeCurrentParcelWeight = takeCurrentParcel.reduce((acc, parcel) => acc + parcel.weightInKg, 0);
      const skipCurrentParcelWeight = skipCurrentParcel.reduce((acc, parcel) => acc + parcel.weightInKg, 0);

      //If weights are similar, we should give priority to the one that can be delivered first
      if (takeCurrentParcelWeight === skipCurrentParcelWeight) {
        //Only take into account the longest distance as it is assumed all destinations can be covered in a single route
        const skipCurrentParcelDistance = skipCurrentParcel.reduce(
          (acc, parcel) => (acc > parcel.destinationDistanceInKm ? acc : parcel.destinationDistanceInKm),
          0,
        );
        const takeCurrentParcelDistance = takeCurrentParcel.reduce(
          (acc, parcel) => (acc > parcel.destinationDistanceInKm ? acc : parcel.destinationDistanceInKm),
          0,
        );

        const minDistance = Math.min(takeCurrentParcelDistance, skipCurrentParcelDistance);
        result = minDistance === takeCurrentParcelDistance ? takeCurrentParcel : skipCurrentParcel;
      } else {
        const max = Math.max(takeCurrentParcelWeight, skipCurrentParcelWeight);
        result = max === takeCurrentParcelWeight ? takeCurrentParcel : skipCurrentParcel;
      }
    }

    //Store result in cache
    cache[index] = cache[index] || [];
    cache[index][maxWeight] = result;

    return result;
  }
}

function calculateDeliveryTimeInHours(
  currentTime: number,
  parcels: ProcessingParcelData[],
  vehicleMaxSpeed: number,
): number {
  //Here we assume the route taken for corresponding parcel is along the way
  const furthestParcel = parcels.reduce((acc, parcel) => {
    parcel.deliveryTimeInHours = BigNumber(currentTime)
      .plus(Math.floor((parcel.destinationDistanceInKm / vehicleMaxSpeed) * 100) / 100)
      .toNumber();

    return parcel.destinationDistanceInKm > acc.destinationDistanceInKm ? parcel : acc;
  }, parcels[0]);

  return roundDownToDecimalPlaces(furthestParcel.destinationDistanceInKm / vehicleMaxSpeed, 2);
}
