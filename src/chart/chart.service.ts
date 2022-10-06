import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { IPositionsResponse } from '../interfaces';
import { GET_ALL_AAPL_POSITIONS } from '../queries';
import { CLEARING_HOUSE_ENDPOINT, TUPLE_FIRST_INDEX } from '../constants';

export interface IChartData {
  time: number;
  value: number;
}

@Injectable()
export class ChartService implements OnModuleInit {
  private _amdChartData: Array<IChartData> = [];
  private _aaplChartData: Array<IChartData> = [];
  private _shopChartData: Array<IChartData> = [];

  constructor(private httpService: HttpService) {}

  async onModuleInit() {
    this.getAaplChartData();
  }

  get aaplChartData() {
    return this._aaplChartData;
  }

  get amdChartData() {
    return this._amdChartData;
  }
  get shopChartData() {
    return this._shopChartData;
  }

  private async getAaplChartData() {
    const aaplPositions =
      await this.httpService.axiosRef.post<IPositionsResponse>(
        CLEARING_HOUSE_ENDPOINT,
        { query: GET_ALL_AAPL_POSITIONS('asc') },
      );

    const modulo = new BigNumber(
      aaplPositions.data.data.positions[TUPLE_FIRST_INDEX].date,
    ).modulo(900);

    let date = new BigNumber(
      aaplPositions.data.data.positions[TUPLE_FIRST_INDEX].date,
    ).minus(modulo);

    let nextDate = date.plus(900);
    let sum = new BigNumber(0);

    for (const position of aaplPositions.data.data.positions) {
      if (new BigNumber(position.date).isLessThan(nextDate)) {
        sum = sum.plus(new BigNumber(position.positionNotional));
      } else {
        this._aaplChartData.push({
          time: date.toNumber(),
          value: Number(sum.toFixed()),
        });
        const modulo = new BigNumber(position.date).modulo(900);
        date = new BigNumber(position.date).minus(modulo);
        nextDate = date.plus(900);
        sum = new BigNumber(0);
      }
    }
  }
}
