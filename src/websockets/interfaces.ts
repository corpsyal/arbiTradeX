
export interface WebsocketLastTradeEvent {
    price: number,
    exchange: Exchange,
    timestamp: number
}

export enum Exchange {
    GATEIO= 'GateIO',
    BINANCE = 'Binance'
}