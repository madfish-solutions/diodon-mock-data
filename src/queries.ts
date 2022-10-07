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
  positions(where: {amm: "0x080486eedaf43c5bd8495fa5aeaca21ed23a58bf"}, orderBy: date, orderDirection: ${orderDirection}) {
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
  positions(where: {amm: "0x7d1ecca059f4c06669c66e4e5708f07fcb5d555d"}, orderBy: date, orderDirection: ${orderDirection}) {
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
  positions(where: {amm: "0x1b3e5d5bc9223e39581062f929dab6d1dc12c7ea"}, orderBy: date, orderDirection: ${orderDirection}) {
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
