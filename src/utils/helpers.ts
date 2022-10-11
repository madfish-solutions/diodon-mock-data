import { BigNumber } from 'bignumber.js';
import { ZERO_AMOUNT } from '../constants';

export const calculatePercentageChange = (
  oldPrice: BigNumber,
  newPrice: BigNumber,
) => {
  if (oldPrice.isEqualTo(ZERO_AMOUNT)) {
    return Number.MAX_SAFE_INTEGER.toFixed();
  }
  return newPrice.multipliedBy(100).dividedBy(oldPrice).minus(100).toFixed(2);
};

export const toReal = (value: BigNumber.Value, decimals = 18) => {
  return new BigNumber(value).div(new BigNumber(10).pow(decimals));
};

export const getLastElement = <T>(array: T[]) => array[array.length - 1];

export const isExist = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;
