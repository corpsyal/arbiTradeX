import { Module } from '@nestjs/common';
import {WebsocketsService} from "./websockets/websockets.service";
import {WebsocketsModule} from "./websockets/websockets.module";
import {ArbitrageOpportunityDetector} from "./arbitrage-opportunity-detector/arbitrage-opportunity-detector";

@Module({
  imports: [WebsocketsModule],
})
export class AppModule {
  constructor(private _websocketsService: WebsocketsService) {
    this._websocketsService.message.pipe(
        ArbitrageOpportunityDetector.filterOpportunity()
    ).subscribe()

  }
}
