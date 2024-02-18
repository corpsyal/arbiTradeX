import { Injectable } from '@nestjs/common';
import {ExchangeGateIO} from "./exchange-gateIO";
import {ExchangeBinance} from "./exchange-binance";
import {combineLatest, filter, merge, Observable, Subscription, switchMap} from "rxjs";

@Injectable()
export class WebsocketsService {
    private _messages$: Observable<any>;

    constructor(private _exchangeBinance: ExchangeBinance) {
        this._messages$ = this._exchangeBinance.isConnected$.pipe(
            switchMap(() => this._exchangeBinance.messages$)
        );
    }

    start(): Subscription {
        return this._messages$.subscribe();
    }

}
