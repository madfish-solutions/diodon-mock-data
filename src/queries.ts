export const GET_ALL_POSITIONS = () => `query {
  positions(orderBy: date, orderDirection: desc) {
    id
    trader
    amm
    margin
    positionNotional
    exchangedPositionSize
    fee
    positionSizeAfter
    realizedPnl
    unrealizedPnlAfter
    badDebt
    liquidationPenalty
    spotPrice
    fundingPayment
    date
  }
}`;

export const GET_ALL_AAPL_POSITIONS = (
  orderDirection: 'asc' | 'desc' = 'desc',
) => `query {
  positions(where: {amm: "0x00c0086a3c2bf842a0a446d8b7d6c395dd63647b"}, orderBy: date, orderDirection: ${orderDirection}) {
    id
    trader
    amm
    margin
    positionNotional
    exchangedPositionSize
    fee
    positionSizeAfter
    realizedPnl
    unrealizedPnlAfter
    badDebt
    liquidationPenalty
    spotPrice
    fundingPayment
    date
  }
}`;

export const GET_ALL_AMD_POSITIONS = (
  orderDirection: 'asc' | 'desc' = 'desc',
) => `query {
  positions(where: {amm: "0x38d58dd8d0890dac771a9eef7eed9e773e0dab1e"}, orderBy: date, orderDirection: ${orderDirection}) {
    id
    trader
    amm
    margin
    positionNotional
    exchangedPositionSize
    fee
    positionSizeAfter
    realizedPnl
    unrealizedPnlAfter
    badDebt
    liquidationPenalty
    spotPrice
    fundingPayment
    date
  }
}`;

export const GET_ALL_SHOP_POSITIONS = (
  orderDirection: 'asc' | 'desc' = 'desc',
) => `query {
  positions(where: {amm: "0xce5e9a5102fadec438a2e209b64b0e1797f9be3b"}, orderBy: date, orderDirection: ${orderDirection}) {
    id
    trader
    amm
    margin
    positionNotional
    exchangedPositionSize
    fee
    positionSizeAfter
    realizedPnl
    unrealizedPnlAfter
    badDebt
    liquidationPenalty
    spotPrice
    fundingPayment
    date
  }
}`;

export const GET_POSITIONS_BY_TRADER = (trader: string) => `query {
  positions(where: {trader: "${trader}"}, orderBy: date, orderDirection: desc) {
    id
    trader
    amm
    margin
    positionNotional
    exchangedPositionSize
    fee
    positionSizeAfter
    realizedPnl
    unrealizedPnlAfter
    badDebt
    liquidationPenalty
    spotPrice
    fundingPayment
    date
  }
}`;

export const GET_POSITION_BY_ID = (id: string) => `query {
  position(id: "${id}") {
    id
    trader
    amm
    margin
    positionNotional
    exchangedPositionSize
    fee
    positionSizeAfter
    realizedPnl
    unrealizedPnlAfter
    badDebt
    liquidationPenalty
    spotPrice
    fundingPayment
    date
  }
}`;

export const GET_ALL_DEPOSITS = () => `query {
  clearingHouses {
    id
    sender
    amm
    amount
    fundingPayment
  }
}`;

export const GET_DEPOSITS_BY_SENDER = (sender: string) => `query {
  clearingHouses(where: {sender: "${sender}"}) {
    id
    sender
    amm
    amount
    fundingPayment
  }
}`;

export const GET_DEPOSIT_BY_ID = (id: string) => `query {
  clearingHouse(id: "${id}") {
    id
    sender
    amm
    amount
    fundingPayment
  }
}`;

export const GET_FUNDING_RATES_AND_INDEX_PRICES = () => `query {
  fundingRates(orderDirection:asc, orderBy: date) {
    id
    rate
    date
    underlyingPrice
  }
}`;
