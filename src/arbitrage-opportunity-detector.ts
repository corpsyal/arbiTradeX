import {bufferCount, Observable, tap} from "rxjs";
import {LastTradeEvent} from "./websockets/interfaces";


export class ArbitrageOpportunityDetector {
    static filterOpportunity(){
        return (observable: Observable<LastTradeEvent>) =>  observable.pipe(
            bufferCount(3, 1),
            tap((e) => console.log(e.map((d) => d.id), 'DEBUG')),
            // implémenter la logique permettant de déduire si une opportunité est présente ou non
            // - proximité temporelle
            // - rentabilité (prise en compte des fees)
        )
    }
}