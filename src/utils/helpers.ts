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
