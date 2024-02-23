import {Exchange, LastTradeEvent, Symbol} from "./interfaces";
import {WebsocketExchangeClient} from "./WebsocketExchangeClient";

export class ExchangeBinance extends WebsocketExchangeClient {
    exchange = Exchange.BINANCE;

    constructor() {
        super(
            Exchange.BINANCE,
            "wss://stream.binance.com:443/ws",
            {
            "method": "SUBSCRIBE",
            "params": [ "btcusdt@trade", "ethusdt@trade", "ethbtc@trade" ],
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
            symbol: this._mapSymbol(event.s)
        }
    }

    protected _mapSymbol(binanceSymbol: string): Symbol {
        const mapping: {[key: string]: Symbol} = {
            'BTCUSDT': Symbol.BTC_USDT,
            'ETHUSDT': Symbol.ETH_USDT,
            'ETHBTC': Symbol.ETH_BTC,
        }
        const symbol = mapping[binanceSymbol];

        if (symbol === undefined) throw new Error(`Symbol ${binanceSymbol} not supported`)

        return symbol;
    }
}