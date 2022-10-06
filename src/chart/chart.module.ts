import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ChartService } from './chart.service';
import { ChartController } from './chart.controller';

@Module({
  imports: [HttpModule],
  providers: [ChartService],
  controllers: [ChartController],
})
export class ChartModule {}
