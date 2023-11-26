import { Module } from '@nestjs/common';
import {ExchangeGateIO} from "./exchange-gateIO";
import {combineLatest, merge, switchMap} from "rxjs";

@Module({
    providers: [ExchangeGateIO]
})
export class WebsocketsModule {
    constructor(private _exchangeGateIO: ExchangeGateIO) {
        combineLatest([
            this._exchangeGateIO.isConnected$
        ])
            .pipe(switchMap(() => merge(
                this._exchangeGateIO.messages$
            )))
            .subscribe()
    }
}
