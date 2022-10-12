import { Controller, Get } from '@nestjs/common';

import { ChartService } from './chart.service';
import { IMarketChartData } from '../interfaces';

@Controller()
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('api/v1/amd/market-prices')
  getAmdMarketPrices(): IMarketChartData {
    return this.chartService.amdChartData;
  }

  @Get('api/v1/aapl/market-prices')
  getAaplMarketPrices(): IMarketChartData {
    return this.chartService.aaplChartData;
  }

  @Get('api/v1/shop/market-prices')
  getShopMarketPrices(): IMarketChartData {
    return this.chartService.shopChartData;
  }
}
