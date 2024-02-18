import {Exchange, LastTradeEvent} from "./interfaces";
import {WebsocketExchangeClient} from "./WebsocketExchangeClient";

export class ExchangeBinance extends WebsocketExchangeClient {
    exchange = Exchange.BINANCE;

    constructor() {
        super(
            Exchange.BINANCE,
            "wss://stream.binance.com:443/ws",
            {
            "method": "SUBSCRIBE",
            "params": [ "btcusdt@trade" ],
            "id": 1
        });
    }

    protected _processMessage(data: any) {
        if (data.e === 'trade')
            this._messages.next(this._mapTrade(data))
    }

    protected _mapTrade(event: any): LastTradeEvent {
        return {
            id: event.t,
            price: event.p,
            exchange: Exchange.BINANCE,
            timestamp: event.T,
            symbol: event.s
        }
    }
}