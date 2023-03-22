import type { Discount } from "@/types/discounts";

export const DISCOUNT_MOCK_DATA: Discount[] = [
  {
    id: 1,
    codeName: "OFR001",
    displayName: "10% Discount",
    minDistance: -1,
    maxDistance: 200,
    minWeight: 70,
    maxWeight: 200,
    percentage: 0.1,
  },
  {
    id: 2,
    codeName: "OFR002",
    displayName: "7% Discount",
    minDistance: 50,
    maxDistance: 150,
    minWeight: 100,
    maxWeight: 250,
    percentage: 0.07,
  },
  {
    id: 3,
    codeName: "OFR003",
    displayName: "5% Discount",
    minDistance: 50,
    maxDistance: 250,
    minWeight: 10,
    maxWeight: 150,
    percentage: 0.05,
  },
];
