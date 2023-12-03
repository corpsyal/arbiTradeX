import {Exchange, WebsocketLastTradeEvent} from "./interfaces"
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
        if (data && data?.event === 'subscribe' && data?.result?.status === 'success')
            this._isConnected.next(true)

        if (data.event === 'update')
            this._messages.next(this._map(data))
    }

    protected _map(event: any): WebsocketLastTradeEvent {
        return {
            exchange: Exchange.GATEIO,
            price: +event.result.price,
            timestamp: event.time_ms
        };
    }
}