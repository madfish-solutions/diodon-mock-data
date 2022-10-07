import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { IPositionsResponse } from '../interfaces';
import {
  GET_ALL_AAPL_POSITIONS,
  GET_ALL_AMD_POSITIONS,
  GET_ALL_SHOP_POSITIONS,
} from '../queries';
import { CLEARING_HOUSE_ENDPOINT, TUPLE_FIRST_INDEX } from '../constants';
import { toReal } from 'src/utils/helpers';

export interface IChartData {
  time: number;
  value: number;
}

const POSITIONS_QUERY_FUNCTIONS: Record<string, typeof GET_ALL_AAPL_POSITIONS> =
  {
    aapl: GET_ALL_AAPL_POSITIONS,
    amd: GET_ALL_AMD_POSITIONS,
    shop: GET_ALL_SHOP_POSITIONS,
  };

@Injectable()
export class ChartService implements OnModuleInit {
  private _chartsData: Record<string, Array<IChartData>> = {
    amd: [],
    aapl: [],
    shop: [],
  };

  constructor(private httpService: HttpService) {}

  async onModuleInit() {
    this.getChartData('aapl');
    this.getChartData('amd');
    this.getChartData('shop');
  }

  get aaplChartData() {
    return this._chartsData.aapl;
  }

  get amdChartData() {
    return this._chartsData.amd;
  }
  get shopChartData() {
    return this._chartsData.shop;
  }

  private async getChartData(marketName: string) {
    const positions = await this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: POSITIONS_QUERY_FUNCTIONS[marketName]('asc') },
    );

    const modulo = new BigNumber(
      positions.data.data.positions[TUPLE_FIRST_INDEX].date,
    ).modulo(900);

    let date = new BigNumber(
      positions.data.data.positions[TUPLE_FIRST_INDEX].date,
    ).minus(modulo);

    let nextDate = date.plus(900);
    let sum = new BigNumber(0);

    for (const position of positions.data.data.positions) {
      if (new BigNumber(position.date).isLessThan(nextDate)) {
        sum = sum.plus(new BigNumber(position.positionNotional));
      } else {
        this._chartsData[marketName].push({
          time: date.toNumber(),
          value: toReal(sum).toNumber(),
        });
        const modulo = new BigNumber(position.date).modulo(900);
        date = new BigNumber(position.date).minus(modulo);
        nextDate = date.plus(900);
        sum = new BigNumber(0);
      }
    }
  }
}
