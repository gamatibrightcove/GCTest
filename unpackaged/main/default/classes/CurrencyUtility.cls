public with sharing class CurrencyUtility {
    private static CurrencyUtility instance = null;

    private Map<String, Decimal> currencyRateMap = new Map<String, Decimal>();
    private Map<String, Integer> currencyRoundMap = new Map<String, Integer>();

    private CurrencyUtility() {
        buildCurrencyRateMap();
        buildCurrencyRoundMap();
    }

    public static CurrencyUtility getInstance() {
        if (instance == null) {
            instance = new CurrencyUtility();
        }

        return instance;
    }

    public Map<String, Decimal> getCurrencyRatesByIsoCode() {
        return currencyRateMap;
    }

    public Map<String, Integer> getCurrencyRoundsByIsoCode() {
        return currencyRoundMap;
    }

    public Decimal convertAndRoundPrice(Decimal price, String currencyIsoCode) {
        if (!currencyRoundMap.containsKey(currencyIsoCode)) {
            return convertPrice(price, currencyIsoCode);
        }

        Decimal conversionRate = currencyRateMap.get(currencyIsoCode);
        Integer roundAmount = currencyRoundMap.get(currencyIsoCode);

        return Math.round((conversionRate * price / roundAmount)) * roundAmount;
    }

    public Decimal convertPrice(Decimal price, String currencyIsoCode) {
        Decimal conversionRate = currencyRateMap.get(currencyIsoCode);
        return conversionRate * price;
    }

    /** HELPER METHODS */

    private void buildCurrencyRateMap() {
        for (DatedConversionRate dcr : [
            SELECT Id, IsoCode, ConversionRate
            FROM DatedConversionRate
            WHERE StartDate <= :Date.today() AND NextStartDate >= :Date.today()
            WITH SECURITY_ENFORCED
        ]) {
            currencyRateMap.put(dcr.IsoCode, dcr.ConversionRate);
        }
    }

    private void buildCurrencyRoundMap() {
        List<CPQ_Price_Rounding__mdt> priceRounding = [
            SELECT Id, Currency__c, Rounding_Amount__c
            FROM CPQ_Price_Rounding__mdt
            WITH SECURITY_ENFORCED
        ];

        for (CPQ_Price_Rounding__mdt pr : priceRounding) {
            currencyRoundMap.put(
                pr.Currency__c,
                (Integer) pr.Rounding_Amount__c
            );
        }
    }
}
