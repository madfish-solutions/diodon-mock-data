import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { IPositionsResponse } from '../interfaces';
import {
  GET_ALL_AAPL_POSITIONS,
  GET_ALL_AMD_POSITIONS,
  GET_ALL_SHOP_POSITIONS,
} from '../queries';
import {
  CLEARING_HOUSE_ENDPOINT,
  FIFTEEN_MINUTES_IN_MILLISECONDS,
  FIFTEEN_MINUTES_IN_SECONDS,
  TUPLE_FIRST_INDEX,
} from '../constants';
import { Interval } from '@nestjs/schedule';

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
    await Promise.all([
      this.aggregateApplChartData(),
      this.aggregateAmdChartData(),
      this.aggregateShopChartData(),
    ]);
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

  private getAaplPositions() {
    const lastElement = this._aaplChartData[this._aaplChartData.length - 1];
    const timestamp = lastElement?.time.toString() ?? '1';
    return this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_AAPL_POSITIONS('asc', timestamp) },
    );
  }
  private getAmdPositions() {
    const lastElement = this._amdChartData[this._amdChartData.length - 1];
    const timestamp = lastElement?.time.toString() ?? '1';
    return this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_AMD_POSITIONS('asc', timestamp) },
    );
  }
  private getShopPositions() {
    const lastElement = this._shopChartData[this._shopChartData.length - 1];
    const timestamp = lastElement?.time.toString() ?? '1';
    return this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_SHOP_POSITIONS('asc', timestamp) },
    );
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateApplChartData() {
    const aaplPositions = await this.getAaplPositions();
    this.aggregateMarketChartData(aaplPositions.data, this._aaplChartData);
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateAmdChartData() {
    const amdPositions = await this.getAmdPositions();
    this.aggregateMarketChartData(amdPositions.data, this._amdChartData);
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateShopChartData() {
    const shopPositions = await this.getShopPositions();
    this.aggregateMarketChartData(shopPositions.data, this._shopChartData);
  }

  private aggregateMarketChartData(
    positions: IPositionsResponse,
    chartData: Array<IChartData>,
  ) {
    const modulo = new BigNumber(
      positions.data.positions[TUPLE_FIRST_INDEX].date,
    ).modulo(FIFTEEN_MINUTES_IN_SECONDS);

    let date = new BigNumber(
      positions.data.positions[TUPLE_FIRST_INDEX].date,
    ).minus(modulo);

    let nextDate = date.plus(FIFTEEN_MINUTES_IN_SECONDS);
    let sum = new BigNumber(0);

    for (const position of positions.data.positions) {
      if (new BigNumber(position.date).isLessThan(nextDate)) {
        sum = sum.plus(new BigNumber(position.positionNotional));
      } else {
        chartData.push({
          time: date.toNumber(),
          value: Number(sum.toFixed()),
        });
        const modulo = new BigNumber(position.date).modulo(
          FIFTEEN_MINUTES_IN_SECONDS,
        );
        date = new BigNumber(position.date).minus(modulo);
        nextDate = date.plus(FIFTEEN_MINUTES_IN_SECONDS);
        sum = new BigNumber(0);
      }
    }
  }

  private async getFundingRateAndIndexPrice() {}
}
