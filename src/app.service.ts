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
  GET_FUNDING_RATES_AND_INDEX_PRICES,
  GET_POSITION_BY_ID,
  GET_POSITIONS_BY_TRADER,
} from './queries';
import {
  IFundingRate,
  IFundingRatesResponse,
  IPositionsResponse,
  ITrade,
} from './interfaces';
import {
  AAPL_AMM_ENDPOINT,
  AMD_AMM_ENDPOINT,
  CLEARING_HOUSE_ENDPOINT,
  SECONDS_IN_DAY,
  SHOP_AMM_ENDPOINT,
  TUPLE_FIRST_INDEX,
  TUPLE_SECOND_INDEX,
  ZERO_AMOUNT,
} from './constants';
import { calculatePercentageChange, toReal } from './utils/helpers';

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

    const [
      aaplInfo,
      amdInfo,
      shopInfo,
      aaplFundingRates,
      amdFundingRates,
      shopFundingRates,
    ] = await Promise.all([
      applPromise,
      amdPromise,
      shopPromise,
      this.getAaplFundingRatesAndIndexPrices(),
      this.getAmdFundingRatesAndIndexPrices(),
      this.getShopFundingRatesAndIndexPrices(),
    ]);

    const aaplResponse = {
      marketId: 'AAPL',
      volume24Tokens: '0',
      marketPriceUsd: toReal(
        aaplInfo.data.data.positions[TUPLE_FIRST_INDEX]?.spotPrice ?? '0',
      ).toFixed(),
      marketPriceChangePercentage: '0',
      marketPriceChange24Usd: '0',
      indexPriceUsd:
        aaplFundingRates[TUPLE_FIRST_INDEX]?.underlyingPrice ?? '0',
      indexPriceChange24Usd: '0',
      indexPriceChangePercentage: '0',
      fundingRate: aaplFundingRates[TUPLE_FIRST_INDEX]?.rate ?? '0',
      fundingRateChangePercentage: '0',
    };

    const amdResponse = {
      marketId: 'AMD',
      volume24Tokens: '0',
      marketPriceUsd: toReal(
        amdInfo.data.data.positions[TUPLE_FIRST_INDEX]?.spotPrice ?? '0',
      ).toFixed(),
      marketPriceChangePercentage: '0',
      marketPriceChange24Usd: '0',
      indexPriceUsd: amdFundingRates[TUPLE_FIRST_INDEX]?.underlyingPrice ?? '0',
      indexPriceChange24Usd: '0',
      indexPriceChangePercentage: '0',
      fundingRate: amdFundingRates[TUPLE_FIRST_INDEX]?.rate ?? '0',
      fundingRateChangePercentage: '0',
    };

    const shopResponse = {
      marketId: 'SHOP',
      volume24Tokens: '0',
      marketPriceUsd: toReal(
        shopInfo.data.data.positions[TUPLE_FIRST_INDEX]?.spotPrice ?? '0',
      ).toFixed(),
      marketPriceChangePercentage: '0',
      marketPriceChange24Usd: '0',
      indexPriceUsd:
        shopFundingRates[TUPLE_FIRST_INDEX]?.underlyingPrice ?? '0',
      indexPriceChange24Usd: '0',
      indexPriceChangePercentage: '0',
      fundingRate: shopFundingRates[TUPLE_FIRST_INDEX]?.rate ?? '0',
      fundingRateChangePercentage: '0',
    };

    aaplResponse.indexPriceChange24Usd =
      this.calculate24HourIndexPricePercentageChange(
        aaplFundingRates,
        aaplResponse.indexPriceUsd,
      );
    amdResponse.indexPriceChange24Usd =
      this.calculate24HourIndexPricePercentageChange(
        amdFundingRates,
        amdResponse.indexPriceUsd,
      );
    shopResponse.indexPriceChange24Usd =
      this.calculate24HourIndexPricePercentageChange(
        shopFundingRates,
        shopResponse.indexPriceUsd,
      );

    aaplResponse.marketPriceChangePercentage =
      this.calculate24HourMarketPricePercentageChange(
        aaplInfo.data,
        aaplResponse.marketPriceUsd,
      );
    amdResponse.marketPriceChangePercentage =
      this.calculate24HourMarketPricePercentageChange(
        amdInfo.data,
        amdResponse.marketPriceUsd,
      );
    shopResponse.marketPriceChangePercentage =
      this.calculate24HourMarketPricePercentageChange(
        shopInfo.data,
        shopResponse.marketPriceUsd,
      );

    aaplResponse.marketPriceChange24Usd = this.calculate24HourMarketPriceChange(
      aaplInfo.data,
      aaplResponse.marketPriceUsd,
    );
    amdResponse.marketPriceChange24Usd = this.calculate24HourMarketPriceChange(
      amdInfo.data,
      amdResponse.marketPriceUsd,
    );
    shopResponse.marketPriceChange24Usd = this.calculate24HourMarketPriceChange(
      shopInfo.data,
      shopResponse.marketPriceUsd,
    );

    aaplResponse.volume24Tokens = this.calculateVolume(
      aaplInfo.data.data.positions,
    );
    amdResponse.volume24Tokens = this.calculateVolume(
      amdInfo.data.data.positions,
    );
    shopResponse.volume24Tokens = this.calculateVolume(
      shopInfo.data.data.positions,
    );

    aaplResponse.fundingRateChangePercentage =
      this.calculateHourlyFundingRateChangePercantage(
        new BigNumber(aaplResponse.marketPriceUsd),
        new BigNumber(aaplResponse.indexPriceUsd),
      );
    amdResponse.fundingRateChangePercentage =
      this.calculateHourlyFundingRateChangePercantage(
        new BigNumber(amdResponse.marketPriceUsd),
        new BigNumber(amdResponse.indexPriceUsd),
      );
    shopResponse.fundingRateChangePercentage =
      this.calculateHourlyFundingRateChangePercantage(
        new BigNumber(shopResponse.marketPriceUsd),
        new BigNumber(shopResponse.indexPriceUsd),
      );

    aaplResponse.indexPriceChangePercentage =
      this.calculateHourlyIndexPriceChangePercantage(
        aaplFundingRates,
        aaplResponse.indexPriceUsd,
      );
    amdResponse.indexPriceChangePercentage =
      this.calculateHourlyIndexPriceChangePercantage(
        amdFundingRates,
        amdResponse.indexPriceUsd,
      );
    shopResponse.indexPriceChangePercentage =
      this.calculateHourlyIndexPriceChangePercantage(
        shopFundingRates,
        shopResponse.indexPriceUsd,
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

  async getAmdFundingRatesAndIndexPrices(): Promise<Array<IFundingRate>> {
    try {
      const a = await this.httpService.axiosRef.post<IFundingRatesResponse>(
        AMD_AMM_ENDPOINT,
        { query: GET_FUNDING_RATES_AND_INDEX_PRICES() },
      );

      return a.data.data.fundingRates;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getAaplFundingRatesAndIndexPrices(): Promise<Array<IFundingRate>> {
    try {
      const a = await this.httpService.axiosRef.post<IFundingRatesResponse>(
        AAPL_AMM_ENDPOINT,
        { query: GET_FUNDING_RATES_AND_INDEX_PRICES() },
      );

      return a.data.data.fundingRates;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async getShopFundingRatesAndIndexPrices(): Promise<Array<IFundingRate>> {
    try {
      const a = await this.httpService.axiosRef.post<IFundingRatesResponse>(
        SHOP_AMM_ENDPOINT,
        { query: GET_FUNDING_RATES_AND_INDEX_PRICES() },
      );

      return a.data.data.fundingRates;
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

    return toReal(accumulatedVolume).toFixed();
  }

  private calculateHourlyFundingRateChangePercantage(
    currentMarketPrice: BigNumber,
    currentIndexPrice: BigNumber,
  ) {
    const currentMarketPriceAtomic = currentMarketPrice.multipliedBy(1e18);
    const premium = currentMarketPriceAtomic.minus(currentIndexPrice);
    const premiumFraction = premium.multipliedBy(3600).dividedBy(86400);

    return premiumFraction.dividedBy(currentIndexPrice).toFixed();
  }

  private calculateHourlyIndexPriceChangePercantage(
    fundingRates: Array<IFundingRate>,
    currentIndexPrice: string,
  ) {
    if (fundingRates.length < 2) {
      return '0';
    }

    const hourAgoPosition = fundingRates[TUPLE_SECOND_INDEX];

    return calculatePercentageChange(
      new BigNumber(hourAgoPosition?.underlyingPrice ?? '0'),
      new BigNumber(currentIndexPrice),
    );
  }

  private calculate24HourMarketPriceChange(
    positionsResponse: IPositionsResponse,
    currentPrice: string,
  ) {
    if (positionsResponse.data.positions.length === 0) {
      return '0';
    }

    const dayAgoDate = new BigNumber(
      positionsResponse.data.positions[TUPLE_FIRST_INDEX].date,
    ).minus(SECONDS_IN_DAY);
    const dayAgoPosition = positionsResponse.data.positions.find(({ date }) =>
      new BigNumber(date).isLessThanOrEqualTo(dayAgoDate),
    );

    return BigNumber(currentPrice)
      .minus(dayAgoPosition?.spotPrice ?? '0')
      .toFixed(2);
  }

  private calculate24HourMarketPricePercentageChange(
    positionsResponse: IPositionsResponse,
    currentPrice: string,
  ) {
    if (positionsResponse.data.positions.length === 0) {
      return '0';
    }

    const dayAgoDate = new BigNumber(
      positionsResponse.data.positions[TUPLE_FIRST_INDEX].date,
    ).minus(SECONDS_IN_DAY);
    const dayAgoPosition = positionsResponse.data.positions.find(({ date }) =>
      dayAgoDate.isGreaterThanOrEqualTo(date),
    );

    return calculatePercentageChange(
      toReal(new BigNumber(dayAgoPosition?.spotPrice ?? '1')),
      new BigNumber(currentPrice),
    );
  }

  private calculate24HourIndexPricePercentageChange(
    fundingRates: Array<IFundingRate>,
    currentPrice: string,
  ) {
    if (fundingRates.length === 0) {
      return '0';
    }

    const dayAgoDate = new BigNumber(
      fundingRates[TUPLE_FIRST_INDEX].date,
    ).minus(SECONDS_IN_DAY);
    const dayAgoPosition = fundingRates.find(({ date }) =>
      new BigNumber(date).isLessThanOrEqualTo(dayAgoDate),
    );
    return calculatePercentageChange(
      toReal(new BigNumber(dayAgoPosition?.underlyingPrice ?? '0')),
      new BigNumber(currentPrice),
    );
  }
}
