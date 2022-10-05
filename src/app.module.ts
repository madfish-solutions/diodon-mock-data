import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";

import { ChartModule } from "./chart";
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule, ChartModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
