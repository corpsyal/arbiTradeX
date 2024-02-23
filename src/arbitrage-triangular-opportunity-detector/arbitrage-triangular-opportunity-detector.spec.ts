import {Exchange, LastTradeEvent, Symbol} from "../websockets/interfaces";
import {ArbitrageTriangularOpportunityDetector} from "./arbitrage-triangular-opportunity-detector";

describe('Arbitrage opportunity detector', () => {
    it('Test du filtre des évènements trop éloignés dans le temps', () => {
        // Arrange
        const events: LastTradeEvent[] = [
            {
                id: 111,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: 1708549051708, // mercredi 21 février 2024 21:57:31.708 GMT+01:00
                symbol: Symbol.BTC_USDT,
            }
        ]

        // Act
        const filteredEvents = ArbitrageTriangularOpportunityDetector.checkTemporality(events);

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
                symbol: Symbol.BTC_USDT,
            }
        ]

        // Act
        const filteredEvents = ArbitrageTriangularOpportunityDetector.checkTemporality(events);

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
                symbol: Symbol.BTC_USDT,
            },
            {
                id: 222,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: Symbol.ETH_USDT,
            },
            {
                id: 333,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: Symbol.ETH_BTC,
            }
        ]

        // Act
        const filteredEvents = ArbitrageTriangularOpportunityDetector.chooseOptimalTriangularEvents(events);

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
                symbol: Symbol.BTC_USDT,
            },
            {
                id: 222,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime(), // maintenant
                symbol: Symbol.ETH_USDT,
            },
            {
                id: 444,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: Symbol.ETH_USDT,
            },
            {
                id: 333,
                price: 111,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime() - 999, // maintenant - 0.99 secondes
                symbol: Symbol.ETH_BTC,
            }
        ]

        // Act
        const filteredEventsIds = ArbitrageTriangularOpportunityDetector.chooseOptimalTriangularEvents(events).map(({id}) => id )

        // Assert
        expect(filteredEventsIds).toEqual([111, 222 , 333]);
    });

    it("Test la detection d'une opportunité", () => {
        // Arrange
        const events: LastTradeEvent[] = [
            {
                id: 1317179527,
                price: 2945.38000000,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime(),
                symbol: Symbol.ETH_USDT
            },
            {
                id: 3432226851,
                price: 51025.30000000,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime(),
                symbol: Symbol.BTC_USDT
            },
            {
                id: 433410534,
                price: 0.05773000,
                exchange: Exchange.BINANCE,
                timestamp: new Date().getTime(),
                symbol: Symbol.ETH_BTC
            }
        ]

        // Act
        const isProfitable = ArbitrageTriangularOpportunityDetector.isProfitable(events);

        // Assert
        expect(isProfitable).toBeFalsy();
    });

})

