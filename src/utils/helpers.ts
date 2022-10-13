import { BigNumber } from 'bignumber.js';

export const calculatePercentageChange = (
  oldPrice: BigNumber,
  newPrice: BigNumber,
) => {
  const difference = newPrice.minus(oldPrice);
  return difference.dividedBy(oldPrice).multipliedBy(100).toFixed(2);
};

export const toReal = (value: BigNumber.Value, decimals = 18) => {
  return new BigNumber(value).div(new BigNumber(10).pow(decimals));
};

export const getLastElement = <T>(array: T[]) => array[array.length - 1];

export const isExist = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;
