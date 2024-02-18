import {BehaviorSubject, filter, Observable, Subject, tap} from "rxjs";
import {Exchange, WebsocketLastTradeEvent} from "./interfaces";
import {Logger} from "@nestjs/common";
import {WebSocket} from "ws";

export abstract class WebsocketExchangeClient {
    protected _logger: Logger;

    private _ws: WebSocket;

    protected _isConnected = new BehaviorSubject<boolean>(false);
    isConnected$: Observable<boolean>;

    protected _messages = new Subject<WebsocketLastTradeEvent>();
    messages$: Observable<WebsocketLastTradeEvent>;

    protected abstract _processMessage(data: any): void;
    protected abstract _mapTrade(event: any): WebsocketLastTradeEvent;

    protected constructor(public exchange: Exchange, protected _wsURL: string, protected _subscribeData: any) {
        this._logger = new Logger(this.exchange);
        this.isConnected$ = this._isConnected.asObservable().pipe(
            filter(connected => connected),
            tap(() => this._logger.verbose(`Connected to ${this.exchange} websocket`)),
            tap(() => this._ws.send(JSON.stringify(this._subscribeData)))
        );
        this.messages$ = this._messages.asObservable().pipe(
            tap(message => this._logger.verbose(`${message.symbol}: ${message.price} - ${new Date(message.timestamp).toLocaleString()}`))
        );

        this._ws = new WebSocket(this._wsURL);

        this._ws.on('message', (data: string) => this._processMessage(JSON.parse(data)));
        this._ws.on('open', () =>  this._isConnected.next(true));
        this._ws.on('error', (error) =>  this._logger.error(error));
    }
}