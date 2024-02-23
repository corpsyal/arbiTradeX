import { Module } from '@nestjs/common';
import {WebsocketsService} from "./websockets/websockets.service";
import {WebsocketsModule} from "./websockets/websockets.module";
import {ArbitrageTriangularOpportunityDetector} from "./arbitrage-triangular-opportunity-detector/arbitrage-triangular-opportunity-detector";
import {tap} from "rxjs";
import {ArbitrageIsProcessingIndicator} from "./arbitrage-is-processing-indicator/arbitrage-is-processing-indicator";

@Module({
  imports: [WebsocketsModule],
})
export class AppModule {
  constructor(private _websocketsService: WebsocketsService) {
    this._websocketsService.message.pipe(
        ArbitrageTriangularOpportunityDetector.filterOpportunity(),
        ArbitrageIsProcessingIndicator.isProcessing(),
        tap((events) => console.log(events, 'DEBUG')),
    ).subscribe()

  }
}
