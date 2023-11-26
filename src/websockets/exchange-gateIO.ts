import {WebsocketClient, WebsocketLastTradeEvent} from "./interfaces";
import { WebSocket } from 'ws';
import {Subject, tap} from "rxjs";


export class ExchangeGateIO implements WebsocketClient {
    private _messages = new Subject<WebsocketLastTradeEvent>();
    messages$ = this._messages.asObservable().pipe(tap(e => console.log(e)))
    private _ws = new WebSocket("wss://api.gateio.ws/ws/v4/");
    private _subscribeData = {
        "time": Date.now(),
        "channel": "spot.trades",
        "event": "subscribe",
        "payload": ["BTC_USDT"]
    };

    constructor() {
        this._ws.on('message', (data: string) => this._messages.next(JSON.parse(data)))
        this._ws.on('open', () => this._ws.send(JSON.stringify(this._subscribeData)));
    }
}