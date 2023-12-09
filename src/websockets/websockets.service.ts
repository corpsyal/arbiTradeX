import { Injectable } from '@nestjs/common';
import {ExchangeGateIO} from "./exchange-gateIO";
import {ExchangeBinance} from "./exchange-binance";
import {combineLatest, merge, Observable, switchMap} from "rxjs";
import {WebsocketLastTradeEvent} from "./interfaces";

@Injectable()
export class WebsocketsService {
    messages$: Observable<WebsocketLastTradeEvent>;

    constructor(private _exchangeGateIO: ExchangeGateIO, private _exchangeBinance: ExchangeBinance) {
        this.messages$ = combineLatest([
            this._exchangeGateIO.isConnected$,
            this._exchangeBinance.isConnected$
        ]).pipe(switchMap(() => merge(
            this._exchangeGateIO.messages$,
            this._exchangeBinance.messages$
        )));
    }

}
