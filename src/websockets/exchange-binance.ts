import {Exchange, WebsocketLastTradeEvent} from "./interfaces";
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
        if (data && data?.result === null && data?.id === 1)
            this._isConnected.next(true)

        if (data.e === 'trade')
            this._messages.next(this._map(data))
    }

    protected _map(event: any): WebsocketLastTradeEvent {
        return {
            price: event.p,
            exchange: Exchange.BINANCE,
            timestamp: event.T
        }
    }
}