import {Exchange, WebsocketClient, WebsocketLastTradeEvent} from "./interfaces";
import { WebSocket } from 'ws';
import {BehaviorSubject, filter, Subject, tap} from "rxjs";
import {Logger} from "@nestjs/common";


export class ExchangeGateIO implements WebsocketClient {
    private _logger = new Logger('ExchangeGateIO');
    exchange = Exchange.GATEIO;

    private _isConnected = new BehaviorSubject<boolean>(false);
    isConnected$ = this._isConnected.asObservable().pipe(
        filter(connected => connected),
        tap(() => this._logger.log('Connected to GateIO websockets'))
    )

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
        this._ws.on('message', (data: string) => this._processMessage(JSON.parse(data)))
        this._ws.on('open', () =>  this._ws.send(JSON.stringify(this._subscribeData)));
    }

    private _processMessage(data: any) {
        if (data && data?.event === 'subscribe' && data?.result?.status === 'success')
            setTimeout(() => { this._isConnected.next(true) }, 5000)

        if (data.event === 'update')
            this._messages.next(data)
    }
}