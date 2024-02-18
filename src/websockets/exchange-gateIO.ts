import {Exchange, LastTradeEvent} from "./interfaces"
import {WebsocketExchangeClient} from "./WebsocketExchangeClient";

export class ExchangeGateIO extends WebsocketExchangeClient {
    exchange = Exchange.GATEIO;

    constructor() {
        super(
            Exchange.GATEIO,
            "wss://api.gateio.ws/ws/v4/", {
            "time": Date.now(),
            "channel": "spot.trades",
            "event": "subscribe",
            "payload": ["BTC_USDT"]
        });
    }

    protected _processMessage(data: any) {
        if (data.event === 'update')
            this._messages.next(this._mapTrade(data))
    }

    protected _mapTrade(event: any): LastTradeEvent {
        return {
            id: event.t,
            exchange: Exchange.GATEIO,
            price: event.result.price,
            timestamp: event.time_ms,
            symbol: event.s
        };
    }
}