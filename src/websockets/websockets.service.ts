import { Injectable } from '@nestjs/common';
import {ExchangeBinance} from "./exchange-binance";
import { Observable, Subscription, switchMap } from "rxjs";
import { LastTradeEvent } from "./interfaces";

@Injectable()
export class WebsocketsService {
    private _message$: Observable<LastTradeEvent> = this._exchangeBinance.isConnected$.pipe(
        switchMap(() => this._exchangeBinance.messages$)
    );

    constructor(private _exchangeBinance: ExchangeBinance) {}

    start(): Subscription {
        return this._message$.subscribe();
    }

    get message(): Observable<LastTradeEvent>{
        return this._message$;
    }

}
