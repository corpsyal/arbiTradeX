import { Module } from '@nestjs/common';
import {ExchangeGateIO} from "./exchange-gateIO";
import {ExchangeBinance} from "./exchange-binance";
import { WebsocketsService } from './websockets.service';

@Module({
    providers: [ExchangeGateIO, ExchangeBinance, WebsocketsService]
})
export class WebsocketsModule {}
