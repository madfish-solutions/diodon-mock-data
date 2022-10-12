export interface ITrade {
  id: string;
  trader: string;
  amm: string;
  margin: string;
  positionNotional: string;
  exchangedPositionSize: string;
  fee: string;
  positionSizeAfter: string;
  realizedPnl: string;
  unrealizedPnlAfter: string;
  badDebt: string;
  liquidationPenalty: string;
  spotPrice: string;
  fundingPayment: string;
  date: string;
}

export interface IPositions {
  positions: Array<ITrade>;
}

export interface IPositionsResponse {
  data: IPositions;
}

export interface IFundingRate {
  id: string;
  rate: string;
  date: string;
  underlyingPrice: string;
}

export interface IFundingRates {
  fundingRates: Array<IFundingRate>;
}

export interface IFundingRatesResponse {
  data: IFundingRates;
}

export interface IChartData {
  time: number;
  value: number;
}

export interface IMarketChartData {
  volumeData: Array<IChartData>;
  spotPriceData: Array<IChartData>;
}
