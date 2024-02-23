import {bufferCount, filter, map, Observable} from "rxjs";
import {LastTradeEvent, Symbol} from "../websockets/interfaces";
import {Logger} from "@nestjs/common";


export class ArbitrageTriangularOpportunityDetector {
    private static _logger = new Logger('ArbitrageTriangularOpportunityDetector')

    static filterOpportunity(){
        return (observable: Observable<LastTradeEvent>) =>  observable.pipe(
            bufferCount(6, 1),
            map(ArbitrageTriangularOpportunityDetector.chooseOptimalTriangularEvents),
            map(ArbitrageTriangularOpportunityDetector.checkTemporality),
            filter(events => events.length === 3),
            filter(ArbitrageTriangularOpportunityDetector.isProfitable)
            //debounceTime(1000),

            // implémenter la logique permettant de déduire si une opportunité est présente ou non
            // - rentabilité (prise en compte des fees)
        )
    }

    static chooseOptimalTriangularEvents(events: LastTradeEvent[]): LastTradeEvent[] {
        const mapEvents = new Map<string, LastTradeEvent>();
        events.sort((a, b) => a.timestamp - b.timestamp ).forEach(event => {
            mapEvents.set(event.symbol, event)
        });
        return [...mapEvents.values()];
    }

    static checkTemporality(events: LastTradeEvent[]): LastTradeEvent[] {
        return events.filter(event => new Date().getTime() - event.timestamp < 1000);
    }

    static isProfitable(events: LastTradeEvent[]): boolean {
        const startUsdtAmount: number = 100;
        const fees = 0.1/100;

        const btcUsdtEvent = events.find(({symbol}) => symbol === Symbol.BTC_USDT )!
        const ethBtcEvent = events.find(({symbol}) => symbol === Symbol.ETH_BTC )!
        const ethUsdtEvent = events.find(({symbol}) => symbol === Symbol.ETH_USDT )!

        const btcPrice = btcUsdtEvent.price; // 51025.30000000 usdt
        const btcAmount = (startUsdtAmount  / btcPrice) * (1-fees); // 0.001957852281123286 btc

        const ethBtcPrice = ethBtcEvent.price; // 0.05773000
        const ethAmount = (btcAmount / ethBtcPrice) * (1-fees); // 0.03388003514363698 eth

        const ethPrice = ethUsdtEvent.price; // 2945.38000000 usdt
        const endUsdtAmount = (ethAmount* ethPrice) * (1-fees); // 99.68978833345412 usdt

        ArbitrageTriangularOpportunityDetector._logger.verbose(`From ${startUsdtAmount} to ${endUsdtAmount}`)
        return endUsdtAmount > startUsdtAmount;
    }
}