import {Exchange, LastTradeEvent, Symbol} from "./interfaces"
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
            "payload": ["BTC_USDT", "ETH_USDT", "ETH_BTC"]
        });
    }

    protected _processMessage(data: any) {
        //console.log(data)
        if (data.event === 'update')
            this._messages.next(this._mapTrade(data))
    }

    protected _mapTrade(event: any): LastTradeEvent {
        return {
            id: event.result.id,
            exchange: Exchange.GATEIO,
            price: event.result.price,
            timestamp: event.time_ms,
            symbol: event.result.currency_pair
        };
    }

    protected _mapSymbol(gateIOSymbol: string): Symbol {
        const mapping: {[key: string]: Symbol} = {
            'BTC_USDT': Symbol.BTC_USDT,
            'ETH_USDT': Symbol.ETH_USDT,
            'ETH_BTC': Symbol.ETH_BTC,
        }
        const symbol = mapping[gateIOSymbol];

        if (symbol === undefined) throw new Error(`Symbol ${gateIOSymbol} not supported`)

        return symbol;
    }
}