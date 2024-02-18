
export interface LastTradeEvent {
    id: number,
    price: number,
    exchange: Exchange,
    timestamp: number,
    symbol: string,
}

export enum Exchange {
    GATEIO= 'GateIO',
    BINANCE = 'Binance'
}