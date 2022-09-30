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
