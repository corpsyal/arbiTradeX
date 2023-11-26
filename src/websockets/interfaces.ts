import {Observable} from "rxjs";

export interface WebsocketLastTradeEvent {

}

export enum Exchange {
    GATEIO,
    BINANCE
}

export interface WebsocketClient {
    messages$: Observable<WebsocketLastTradeEvent>
}