import { Module } from '@nestjs/common';
import {ExchangeGateIO} from "./exchange-gateIO";

@Module({
    providers: [ExchangeGateIO]
})
export class WebsocketsModule {
    constructor(private _exchangeGateIO: ExchangeGateIO) {
        this._exchangeGateIO.messages$.subscribe();
    }
}
