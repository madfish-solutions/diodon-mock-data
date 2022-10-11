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
import { getLastElement, isExist } from '../utils/helpers';

export interface IChartData {
  time: number;
  value: number;
}

@Injectable()
export class ChartService implements OnModuleInit {
  private aaplLastTimestamp = '1';
  private amdLastTimestamp = '1';
  private shopLastTimestamp = '1';
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
    return this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_AAPL_POSITIONS('asc', this.aaplLastTimestamp) },
    );
  }
  private getAmdPositions() {
    return this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_AMD_POSITIONS('asc', this.amdLastTimestamp) },
    );
  }
  private getShopPositions() {
    return this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_SHOP_POSITIONS('asc', this.shopLastTimestamp) },
    );
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateApplChartData() {
    const aaplPositions = await this.getAaplPositions();
    this.aggregateMarketChartData(aaplPositions.data, this._aaplChartData);

    const lastElement = getLastElement(aaplPositions.data.data.positions);

    if (isExist(lastElement)) {
      this.aaplLastTimestamp = lastElement.date;
    }
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateAmdChartData() {
    const amdPositions = await this.getAmdPositions();
    this.aggregateMarketChartData(amdPositions.data, this._amdChartData);

    const lastElement = getLastElement(amdPositions.data.data.positions);

    if (isExist(lastElement)) {
      this.amdLastTimestamp = lastElement.date;
    }
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateShopChartData() {
    const shopPositions = await this.getShopPositions();
    this.aggregateMarketChartData(shopPositions.data, this._shopChartData);

    const lastElement = getLastElement(shopPositions.data.data.positions);

    if (isExist(lastElement)) {
      this.amdLastTimestamp = lastElement.date;
    }
  }

  private aggregateMarketChartData(
    positions: IPositionsResponse,
    chartData: Array<IChartData>,
  ) {
    if (positions.data.positions.length === 0) {
      return;
    }

    const modulo = new BigNumber(
      positions.data.positions[TUPLE_FIRST_INDEX].date,
    ).modulo(FIFTEEN_MINUTES_IN_SECONDS);

    let date = new BigNumber(
      positions.data.positions[TUPLE_FIRST_INDEX].date,
    ).minus(modulo);

    let nextDate = date.plus(FIFTEEN_MINUTES_IN_SECONDS);
    let sum = new BigNumber(0);

    for (const position of positions.data.positions) {
      if (nextDate.isGreaterThan(position.date)) {
        sum = sum.plus(
          new BigNumber(position.positionNotional).dividedBy(1e18),
        );
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
        sum = new BigNumber(position.positionNotional).dividedBy(1e18);
      }
    }
  }
}
