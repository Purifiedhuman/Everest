export type Discount = {
  id: number;
  codeName: string | null;
  displayName: string;
  percentage: number;
  minDistance: number;
  maxDistance: number;
  minWeight: number;
  maxWeight: number;
};
