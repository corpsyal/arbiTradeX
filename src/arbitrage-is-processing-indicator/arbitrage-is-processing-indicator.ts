import {delay, filter, Observable, tap} from "rxjs";
import {Logger} from "@nestjs/common";


export class ArbitrageIsProcessingIndicator {
    private static _logger: Logger = new Logger('Arbitrage is processing indicator')
    private static _isProcessing: boolean = false;

    private static _toggleIsProcessing(processing: boolean){
        ArbitrageIsProcessingIndicator._isProcessing = processing
        ArbitrageIsProcessingIndicator._logger.debug(`Current status is: ${ArbitrageIsProcessingIndicator._isProcessing}`);
    }

    static isProcessing<T>() {
        return (observable: Observable<T>) => {
            return observable.pipe(
                filter(() => !ArbitrageIsProcessingIndicator._isProcessing),
                tap(() => ArbitrageIsProcessingIndicator._toggleIsProcessing(true)),
            )
        }
    }

    static resetIsProcessing() {
        ArbitrageIsProcessingIndicator._toggleIsProcessing(false);
    }
}