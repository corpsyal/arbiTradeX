import { Module } from '@nestjs/common';
import {ExchangeBinance} from "./exchange-binance";
import { WebsocketsService } from './websockets.service';
import {ExchangeGateIO} from "./exchange-gateIO";

@Module({
    providers: [ExchangeBinance, ExchangeGateIO, WebsocketsService],
    exports: [WebsocketsService]
})
export class WebsocketsModule {
    constructor() {}
}
