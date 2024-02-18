import { Module } from '@nestjs/common';
import {ExchangeBinance} from "./exchange-binance";
import { WebsocketsService } from './websockets.service';

@Module({
    providers: [ExchangeBinance, WebsocketsService],
    exports: [WebsocketsService]
})
export class WebsocketsModule {
    constructor() {
        console.log('websocket module constructor')
    }
}
