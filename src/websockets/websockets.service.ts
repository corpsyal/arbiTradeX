import { Injectable } from '@nestjs/common';
import {ExchangeBinance} from "./exchange-binance";
import {bufferCount, Observable, Subscription, switchMap} from "rxjs";
import { LastTradeEvent } from "./interfaces";

@Injectable()
export class WebsocketsService {
     _message$: Observable<LastTradeEvent> = this._exchangeBinance.isConnected$.pipe(
        switchMap(() => this._exchangeBinance.messages$),
    );

    constructor(private _exchangeBinance: ExchangeBinance) {}

    get message(): Observable<LastTradeEvent>{
        return this._message$;
    }

}
