import { Module } from '@nestjs/common';
import {ExchangeGateIO} from "./exchange-gateIO";
import {ExchangeBinance} from "./exchange-binance";
import {combineLatest, merge, switchMap} from "rxjs";

@Module({
    providers: [ExchangeGateIO, ExchangeBinance]
})
export class WebsocketsModule {
    constructor(private _exchangeGateIO: ExchangeGateIO, private _exchangeBinance: ExchangeBinance) {

        combineLatest([
            this._exchangeGateIO.isConnected$,
            this._exchangeBinance.isConnected$
        ])
            .pipe(switchMap(() => merge(
                this._exchangeGateIO.messages$,
                this._exchangeBinance.messages$
            )))
            .subscribe()


    }
}
