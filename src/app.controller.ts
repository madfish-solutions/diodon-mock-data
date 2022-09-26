import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

const mockAccountData = {
  netCollateralTokens: 6000,
  netCollateralUsd: 6006,
  freeCollateralTokens: 400,
  freeCollateralUsd: 400.4,
  marginRatioPercent: 31.2,
  leverage: 3.205,
  buyingPowerUsd: 4004,
};

const mockOpenAccountPositions = [
  {
    marketId: 'AMD',
    type: 'LONG',
    amountTokens: 10.43956,
    amountUsd: 10.45,
    pnlPercent: -50.26,
    pnlUsd: -10.56,
    avgOpenPriceUsd: 170.18,
    liqPrice1Usd: 50,
    liqPrice2Usd: 30,
  },
  {
    marketId: 'SHOP',
    type: 'SHORT',
    amountTokens: 1605.124875,
    amountUsd: 1606.73,
    pnlPercent: 10.98,
    pnlUsd: 176.43,
    avgOpenPriceUsd: 34.34,
    liqPrice1Usd: 45,
    liqPrice2Usd: 52.5,
  },
];

const mockMarketsData = [
  {
    marketId: 'AMD',
    marketPriceUsd: 84.63,
    marketPriceChange24Usd: 1.85,
    indexPriceUsd: 84.8,
    indexPriceChange24Usd: 1.86,
    volume24Tokens: 83416.583416,
    volume24Usd: 83500,
    fundingRateChange8Percent: 0.0088,
  },
  {
    marketId: 'AAPL',
    marketPriceUsd: 156.74,
    marketPriceChange24Usd: 2.27,
    indexPriceUsd: 156.6,
    indexPriceChange24Usd: 2.24,
    volume24Tokens: 77422.577422,
    volume24Usd: 77500,
    fundingRateChange8Percent: -0.0012,
  },
  {
    marketId: 'SHOP',
    marketPriceUsd: 34.34,
    marketPriceChange24Usd: 2.4,
    indexPriceUsd: 34.2,
    indexPriceChange24Usd: 2.16,
    volume24Tokens: 64735.264735,
    volume24Usd: 64800,
    fundingRateChange8Percent: -0.0535,
  },
];

const mockMarketTicks = {
  AMD: [
    {
      timestamp: 1662912000000,
      marketPriceUsd: 82.78,
      indexPriceUsd: 82.94,
      fundingRatePercent: 0.0536,
    },
    {
      timestamp: 1662940800000,
      marketPriceUsd: 83.4,
      indexPriceUsd: 83.56,
      fundingRatePercent: 0.0624,
    },
    {
      timestamp: 1662969600000,
      marketPriceUsd: 84.01,
      indexPriceUsd: 84.18,
      fundingRatePercent: 0.0712,
    },
    {
      timestamp: 1662998400000,
      marketPriceUsd: 84.63,
      indexPriceUsd: 84.8,
      fundingRatePercent: 0.08,
    },
  ],
  AAPL: [
    {
      timestamp: 1662912000000,
      marketPriceUsd: 154.47,
      indexPriceUsd: 154.36,
      fundingRatePercent: 0.0736,
    },
    {
      timestamp: 1662940800000,
      marketPriceUsd: 155.23,
      indexPriceUsd: 155.11,
      fundingRatePercent: 0.0724,
    },
    {
      timestamp: 1662969600000,
      marketPriceUsd: 155.85,
      indexPriceUsd: 84.18,
      fundingRatePercent: 0.0712,
    },
    {
      timestamp: 1662998400000,
      marketPriceUsd: 156.74,
      indexPriceUsd: 156.6,
      fundingRatePercent: 0.07,
    },
  ],
  SHOP: [
    {
      timestamp: 1662912000000,
      marketPriceUsd: 31.94,
      indexPriceUsd: 32.04,
      fundingRatePercent: 0.1154,
    },
    {
      timestamp: 1662940800000,
      marketPriceUsd: 32.74,
      indexPriceUsd: 32.76,
      fundingRatePercent: 0.114,
    },
    {
      timestamp: 1662969600000,
      marketPriceUsd: 33.54,
      indexPriceUsd: 33.48,
      fundingRatePercent: 0.1135,
    },
    {
      timestamp: 1662998400000,
      marketPriceUsd: 34.34,
      indexPriceUsd: 34.2,
      fundingRatePercent: 0.06,
    },
  ],
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  getAccountPkh(request: Request) {
    const accountPkhHeader = request.headers['accountpkh'];
    return accountPkhHeader instanceof Array
      ? accountPkhHeader[0]
      : accountPkhHeader;
  }

  @Get('/api/v1/markets')
  getMarkets() {
    return { markets: mockMarketsData };
  }

  @Get('/api/v1/account')
  getAccountData(@Req() request: Request) {
    const accountPkh = this.getAccountPkh(request);
    return {
      accountPkh,
      data: accountPkh
        ? mockAccountData
        : {
            netCollateralTokens: 0,
            netCollateralUsd: 0,
            freeCollateralTokens: 0,
            freeCollateralUsd: 0,
            marginRatioPercent: 100,
            leverage: 1,
            buyingPowerUsd: 0,
          },
    };
  }

  @Get('/api/v1/positions')
  getPositions(@Req() request: Request) {
    const accountPkh = this.getAccountPkh(request);
    return {
      accountPkh,
      positions: accountPkh ? mockOpenAccountPositions : [],
    };
  }

  @Get('/api/v1/market-chart/:marketId')
  getChart(@Param('marketId') marketId: string, @Res() response: Response) {
    if (marketId in mockMarketTicks) {
      response.json({
        marketId,
        ticks: mockMarketTicks[marketId],
      });
    } else {
      response.status(404).send({
        error: 'Market not found',
      });
    }
  }
}
