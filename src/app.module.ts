import { Module } from '@nestjs/common';
import {WebsocketsService} from "./websockets/websockets.service";
import {WebsocketsModule} from "./websockets/websockets.module";
import {ArbitrageOpportunityDetector} from "./arbitrage-opportunity-detector/arbitrage-opportunity-detector";
import {BehaviorSubject, tap} from "rxjs";
import {ArbitrageIsProcessingIndicator} from "./arbitrage-is-processing-indicator/arbitrage-is-processing-indicator";

@Module({
  imports: [WebsocketsModule],
})
export class AppModule {
  constructor(private _websocketsService: WebsocketsService) {
    const isPorcessing = new BehaviorSubject<boolean>(false);
    this._websocketsService.message.pipe(
        ArbitrageOpportunityDetector.filterOpportunity(),
        ArbitrageIsProcessingIndicator.isProcessing(),
        tap((events) => console.log(events, 'DEBUG')),
    ).subscribe()

  }
}
