import { Controller, Get } from '@nestjs/common';

import { ChartService, IChartData } from './chart.service';

@Controller()
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('api/v1/amd/market-prices')
  getAmdMarketPrices(): Array<IChartData> {
    return this.chartService.amdChartData;
  }

  @Get('api/v1/aapl/market-prices')
  getAaplMarketPrices(): Array<IChartData> {
    return this.chartService.aaplChartData;
  }

  @Get('api/v1/shop/market-prices')
  getShopMarketPrices(): Array<IChartData> {
    return this.chartService.shopChartData;
  }
}
