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
  positions(where: {amm: "0x00c0086a3c2bf842A0A446d8B7d6c395dd63647B"}, orderBy: date, orderDirection: desc) {
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
  positions(where: {amm: "0x38D58DD8d0890dAC771A9eeF7eEd9E773e0DAb1e"}, orderBy: date, orderDirection: desc) {
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
  positions(where: {amm: "0xce5E9a5102fadEC438a2E209b64b0e1797F9be3B"}, orderBy: date, orderDirection: desc) {
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
