
export interface LastTradeEvent {
    id: number,
    price: number,
    exchange: Exchange,
    timestamp: number,
    symbol: Symbol,
}

export enum Exchange {
    GATEIO= 'GateIO',
    BINANCE = 'Binance'
}

export enum Symbol {
    BTC_USDT = "BTC_USDT",
    ETH_USDT = "ETH_USDT",
    ETH_BTC = "ETH_BTC",
}
