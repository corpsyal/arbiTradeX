import {bufferCount, debounceTime, filter, map, Observable, tap} from "rxjs";
import {LastTradeEvent} from "../websockets/interfaces";


export class ArbitrageOpportunityDetector {
    static filterOpportunity(){
        return (observable: Observable<LastTradeEvent>) =>  observable.pipe(
            bufferCount(6, 1),
            map(ArbitrageOpportunityDetector.chooseOptimalTriangularEvents),
            map(ArbitrageOpportunityDetector.checkTemporality),
            filter(events => events.length === 3),
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
}