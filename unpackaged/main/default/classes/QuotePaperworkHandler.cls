public with sharing class QuotePaperworkHandler extends DomainLogicHandler {
    List<SBQQ__Quote__c> workSet = new List<SBQQ__Quote__c>();

    public override void check(SObject newObj, SObject oldObj) {
        SBQQ__Quote__c quote = (SBQQ__Quote__c) newObj;

        quote.Has_Legal_Notes__c = quote.Legal_Notes__c != null;
        quote.SBQQ__WatermarkShown__c = quote.SBQQ__Status__c != 'Approved';
        workSet.add((SBQQ__Quote__c) newObj);
    }

    public override void processRecords() {
        Set<Id> quoteIds = new Set<Id>();

        for (SBQQ__Quote__c quote : workSet) {
            quoteIds.add(quote.Id);
        }

        Map<Id, SBQQ__Quote__c> currentQuotes = new Map<Id, SBQQ__Quote__c>(
            [
                SELECT
                    Id,
                    Initial_Term_Amount_Renew__c,
                    SBQQ__SubscriptionTerm__c,
                    Initial_Term_Length__c,
                    (
                        SELECT
                            Id,
                            Paperwork_Product_Type__c,
                            SBQQ__Product__r.No_Proration__c,
                            SBQQ__NetTotal__c
                        FROM SBQQ__LineItems__r
                    )
                FROM SBQQ__Quote__c
                WHERE Id IN :quoteIds
            ]
        );

        for(SBQQ__Quote__c quote : workSet) {
            SBQQ__Quote__c currentQuote = currentQuotes.get(quote.Id);
            Decimal initialTermTotal = 0.0;
            for(SBQQ__QuoteLine__c quoteLine : currentQuote.SBQQ__LineItems__r) {
                if(quoteLine.Paperwork_Product_Type__c == 'One-Time') {
                    continue;
                }

                if(quoteLine.SBQQ__Product__r.No_Proration__c) {
                    initialTermTotal += (Decimal)(quoteLine.SBQQ__NetTotal__c) / Math.floor(quote.SBQQ__SubscriptionTerm__c / quote.Initial_Term_Length__c).setScale(2);
                    continue;
                }

                if(quote.SBQQ__SubscriptionTerm__c < 12) {
                    initialTermTotal += (Decimal)((quoteLine.SBQQ__NetTotal__c / quote.SBQQ__SubscriptionTerm__c) * quote.Initial_Term_Length__c).setScale(2);
                } else {
                    initialTermTotal += (Decimal)((quoteLine.SBQQ__NetTotal__c / quote.SBQQ__SubscriptionTerm__c) * (quote.Initial_Term_Length__c - Math.mod((Integer)quote.Initial_Term_Length__c, 12))).setScale(2);
                }
            }

            quote.Initial_Term_Amount_Renew__c = initialTermTotal;
        }
    }
}