import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { IMarketChartData, IPositionsResponse } from '../interfaces';
import {
  GET_ALL_AAPL_POSITIONS,
  GET_ALL_AMD_POSITIONS,
  GET_ALL_SHOP_POSITIONS,
} from '../queries';
import {
  CLEARING_HOUSE_ENDPOINT,
  FIFTEEN_MINUTES_IN_MILLISECONDS,
} from '../constants';
import { Interval } from '@nestjs/schedule';
import { getLastElement, isExist } from '../utils/helpers';

@Injectable()
export class ChartService implements OnModuleInit {
  private aaplLastTimestamp = '1';
  private amdLastTimestamp = '1';
  private shopLastTimestamp = '1';
  private _amdChartData: IMarketChartData = {
    volumeData: [],
    spotPriceData: [],
  };
  private _aaplChartData: IMarketChartData = {
    volumeData: [],
    spotPriceData: [],
  };
  private _shopChartData: IMarketChartData = {
    volumeData: [],
    spotPriceData: [],
  };

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
    this.aggregateChartData(aaplPositions.data, this._aaplChartData);

    const lastElement = getLastElement(aaplPositions.data.data.positions);

    if (isExist(lastElement)) {
      this.aaplLastTimestamp = lastElement.date;
    }
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateAmdChartData() {
    const amdPositions = await this.getAmdPositions();
    this.aggregateChartData(amdPositions.data, this._amdChartData);

    const lastElement = getLastElement(amdPositions.data.data.positions);

    if (isExist(lastElement)) {
      this.amdLastTimestamp = lastElement.date;
    }
  }

  @Interval(FIFTEEN_MINUTES_IN_MILLISECONDS)
  private async aggregateShopChartData() {
    const shopPositions = await this.getShopPositions();
    this.aggregateChartData(shopPositions.data, this._shopChartData);

    const lastElement = getLastElement(shopPositions.data.data.positions);

    if (isExist(lastElement)) {
      this.amdLastTimestamp = lastElement.date;
    }
  }

  private async aggregateChartData(
    positions: IPositionsResponse,
    chartData: IMarketChartData,
  ) {
    if (positions.data.positions.length === 0) {
      return;
    }

    for (const position of positions.data.positions) {
      chartData.spotPriceData.push({
        time: Number(position.date),
        value: new BigNumber(position.spotPrice).dividedBy(1e18).toNumber(),
      });
      chartData.volumeData.push({
        time: Number(position.date),
        value: new BigNumber(position.positionNotional)
          .dividedBy(1e18)
          .toNumber(),
      });
    }
  }
}
