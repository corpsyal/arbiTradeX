import { Injectable } from '@nestjs/common';
import {ExchangeBinance} from "./exchange-binance";
import {combineLatest, merge, Observable, switchMap} from "rxjs";
import { LastTradeEvent } from "./interfaces";
import {ExchangeGateIO} from "./exchange-gateIO";

@Injectable()
export class WebsocketsService {
     _message$: Observable<LastTradeEvent> = combineLatest([
         this._exchangeBinance.isConnected$,
         this._exchangeGateIO.isConnected$
     ]).pipe(
        switchMap(() => merge(
            this._exchangeBinance.messages$,
            this._exchangeGateIO.messages$,
        )),
    );

    constructor(private _exchangeBinance: ExchangeBinance, private _exchangeGateIO: ExchangeGateIO) {}

    get message(): Observable<LastTradeEvent>{
        return this._message$;
    }

}
