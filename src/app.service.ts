import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BigNumber } from 'bignumber.js';
import {
  GET_ALL_AAPL_POSITIONS,
  GET_ALL_AMD_POSITIONS,
  GET_ALL_DEPOSITS,
  GET_ALL_POSITIONS,
  GET_ALL_SHOP_POSITIONS,
  GET_DEPOSIT_BY_ID,
  GET_DEPOSITS_BY_SENDER,
  GET_POSITION_BY_ID,
  GET_POSITIONS_BY_TRADER,
} from './queries';
import { IPositionsResponse, ITrade } from './interfaces';
import { SECONDS_IN_DAY, TUPLE_FIRST_INDEX, ZERO_AMOUNT } from './constants';

const CLEARING_HOUSE_ENDPOINT =
  'http://157.230.234.73:8000/subgraphs/name/custom-subgraph';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getMarkets() {
    const applPromise = this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_AAPL_POSITIONS() },
    );
    const amdPromise = this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_AMD_POSITIONS() },
    );
    const shopPromise = this.httpService.axiosRef.post<IPositionsResponse>(
      CLEARING_HOUSE_ENDPOINT,
      { query: GET_ALL_SHOP_POSITIONS() },
    );

    const [aaplInfo, amdInfo, shopInfo] = await Promise.all([
      applPromise,
      amdPromise,
      shopPromise,
    ]);

    const aaplResponse = {
      marketId: 'AAPL',
      volume24Tokens: '0',
      marketPriceUsd:
        aaplInfo.data.data.positions[TUPLE_FIRST_INDEX]?.spotPrice ?? '0',
    };

    const amdResponse = {
      marketId: 'AMD',
      volume24Tokens: '0',
      marketPriceUsd:
        amdInfo.data.data.positions[TUPLE_FIRST_INDEX]?.spotPrice ?? '0',
    };

    const shopResponse = {
      marketId: 'SHOP',
      volume24Tokens: '0',
      marketPriceUsd:
        shopInfo.data.data.positions[TUPLE_FIRST_INDEX]?.spotPrice ?? '0',
    };

    aaplResponse.volume24Tokens = this.calculateVolume(
      aaplInfo.data.data.positions,
    );
    amdResponse.volume24Tokens = this.calculateVolume(
      amdInfo.data.data.positions,
    );
    shopResponse.volume24Tokens = this.calculateVolume(
      shopInfo.data.data.positions,
    );

    return [aaplResponse, amdResponse, shopResponse];
  }

  async getAllTrades() {
    try {
      const response = await this.httpService.axiosRef.post(
        CLEARING_HOUSE_ENDPOINT,
        {
          query: GET_ALL_POSITIONS(),
        },
      );

      return response.data.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getAllTradesByTrader(trader: string) {
    try {
      const a = await this.httpService.axiosRef.post(CLEARING_HOUSE_ENDPOINT, {
        query: GET_POSITIONS_BY_TRADER(trader),
      });

      return a.data.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getTradeById(id: string) {
    try {
      const a = await this.httpService.axiosRef.post(CLEARING_HOUSE_ENDPOINT, {
        query: GET_POSITION_BY_ID(id),
      });

      return a.data.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getDeposits() {
    try {
      const a = await this.httpService.axiosRef.post(CLEARING_HOUSE_ENDPOINT, {
        query: GET_ALL_DEPOSITS(),
      });

      return a.data.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getDepositsBySender(sender: string) {
    try {
      const a = await this.httpService.axiosRef.post(CLEARING_HOUSE_ENDPOINT, {
        query: GET_DEPOSITS_BY_SENDER(sender),
      });

      return a.data.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getDepositById(id: string) {
    try {
      const a = await this.httpService.axiosRef.post(CLEARING_HOUSE_ENDPOINT, {
        query: GET_DEPOSIT_BY_ID(id),
      });

      return a.data.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  private calculateVolume(tradeInfo: Array<ITrade>) {
    const timestampForDayAgo = Math.floor(Date.now() / 1000) - SECONDS_IN_DAY;
    let accumulatedVolume = new BigNumber(ZERO_AMOUNT);

    for (const trade of tradeInfo) {
      if (Number(trade.date) > timestampForDayAgo) {
        accumulatedVolume = accumulatedVolume.plus(trade.positionNotional);
      } else {
        break;
      }
    }

    return accumulatedVolume.toFixed();
  }
}
