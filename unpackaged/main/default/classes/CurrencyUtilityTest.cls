@isTest
public class CurrencyUtilityTest {
    @isTest
    static void testConvertAndRound() {
        Map<String, Decimal> currencyRatesMap = CurrencyUtility.getInstance()
            .getCurrencyRatesByIsoCode();
        Map<String, Integer> currencyRoundsMap = CurrencyUtility.getInstance()
            .getCurrencyRoundsByIsoCode();

        Decimal inputValue = 16500.0;

        System.assert(
            !currencyRoundsMap.isEmpty(),
            'currencyRoundMap was not populated'
        );

        for (String isoCode : currencyRatesMap.keySet()) {
            Decimal expectedRate = currencyRatesMap.get(isoCode);
            Integer expectedRound = currencyRoundsMap.containsKey(isoCode)
                ? currencyRoundsMap.get(isoCode)
                : 1;
            Decimal expectedOutput =
                Math.round(expectedRate * inputValue / expectedRound) *
                expectedRound;

            Decimal outputValue = CurrencyUtility.getInstance()
                .convertAndRoundPrice(inputValue, isoCode);

            System.assertEquals(
                expectedOutput,
                outputValue,
                'Error converting price, price not converted properly'
            );
        }
    }

    @IsTest
    static void testConvert() {
        Map<String, Decimal> currencyRatesMap = CurrencyUtility.getInstance()
            .getCurrencyRatesByIsoCode();

        Decimal inputValue = 16500.0;

        for (String isoCode : currencyRatesMap.keySet()) {
            Decimal expectedRate = currencyRatesMap.get(isoCode);
            Decimal expectedOutput = expectedRate * inputValue;

            Decimal outputValue = CurrencyUtility.getInstance()
                .convertPrice(inputValue, isoCode);

            System.assertEquals(
                expectedOutput,
                outputValue,
                'Error converting price, price not converted properly'
            );
        }
    }
}
