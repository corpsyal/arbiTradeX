import {Exchange, LastTradeEvent} from "../websockets/interfaces";
import {ArbitrageOpportunityDetector} from "./arbitrage-opportunity-detector";
import * as assert from "assert";

describe('Arbitrage opportunity detector', () => {
    it('Test du filtre des évènements trop éloignés dans le temps', () => {
        // Arrange
        const events: LastTradeEvent[] = [
            {
                id: 111,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: 1708549051708, // mercredi 21 février 2024 21:57:31.708 GMT+01:00
                symbol: 'BTCUSDT',
            }
        ]

        // Act
        const filteredEvents = ArbitrageOpportunityDetector.checkTemporality(events);

        // Assert
        expect(filteredEvents).toEqual([]);
    });

    it('Test du filtre des évènements datant de moins de 1 seconde', () => {
        // Arrange
        const events: LastTradeEvent[] = [
            {
                id: 111,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'BTCUSDT',
            }
        ]

        // Act
        const filteredEvents = ArbitrageOpportunityDetector.checkTemporality(events);

        // Assert
        expect(filteredEvents.at(0)?.id).toEqual(111);
    });

    it('Test la selection des évènements (devrait retourner 3 évènements pour chaques paires)', () => {
        // Arrange
        const events: LastTradeEvent[] = [
            {
                id: 111,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'BTCUSDT',
            },
            {
                id: 222,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'ETHUSDT',
            },
            {
                id: 333,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'ETHBTC',
            }
        ]

        // Act
        const filteredEvents = ArbitrageOpportunityDetector.chooseOptimalTriangularEvents(events);

        // Assert
        expect(filteredEvents).toEqual(events);
    });

    it('Test la selection des évènements avec des évènements en double (devrait retourner 3 évènements pour chaques paires)', () => {
        // Arrange
        const events: LastTradeEvent[] = [
            {
                id: 111,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'BTCUSDT',
            },
            {
                id: 222,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime(), // maintenant
                symbol: 'ETHUSDT',
            },
            {
                id: 444,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'ETHUSDT',
            },
            {
                id: 333,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: 'ETHBTC',
            }
        ]

        // Act
        const filteredEventsIds = ArbitrageOpportunityDetector.chooseOptimalTriangularEvents(events).map(({id}) => id )

        // Assert
        expect(filteredEventsIds).toEqual([111, 222 , 333]);
    });

})

