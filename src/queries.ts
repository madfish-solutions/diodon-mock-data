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

export const GET_ALL_AAPL_POSITIONS = () => `query {
  positions(where: {amm: "0x339ede517f4579dde6b79ad356ea7bb9dcf9d1ec"}, orderBy: date, orderDirection: desc) {
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

export const GET_ALL_AMD_POSITIONS = () => `query {
  positions(where: {amm: "0x0b77f0b48c4fe204e497c8993e0ff72c85c9c7f1"}, orderBy: date, orderDirection: desc) {
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

export const GET_ALL_SHOP_POSITIONS = () => `query {
  positions(where: {amm: "0xbf01142fa45e5ac376f955b62f059d585ab42e65"}, orderBy: date, orderDirection: desc) {
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
