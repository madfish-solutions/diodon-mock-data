import { HttpService } from "@nestjs/axios";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";

import { IPositionsResponse } from "../interfaces";
import { GET_ALL_AAPL_POSITIONS } from "../queries";
import { CLEARING_HOUSE_ENDPOINT } from "../constants";

export interface IChartData {
  time: string;
  value: number;
}

@Injectable()
export class ChartService implements OnModuleInit{
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

  @Interval(5000)
  private async getAaplChartData() {
    console.log('getAaplChartData');
    console.log('Date: ',new Date(Date.now()).toISOString());

    const aaplPositions = await this.httpService.axiosRef.post<IPositionsResponse>( CLEARING_HOUSE_ENDPOINT, { query: GET_ALL_AAPL_POSITIONS() } );

    return aaplPositions.data.data.positions;
  }
}
