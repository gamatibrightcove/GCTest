public with sharing class ContractLineSummaryController {
    private String sectionName = 'Quote Lines';
    public List<SBQQ__LineColumn__c> lineColumns { get; set; }
    public List<SBQQ__QuoteLine__c> quoteLines { get; set; }
    public List<LineItemSummary> lineSummaries { get; set; }

    public ContractLineSummaryController() {
        Id quoteId = (Id) ApexPages.currentPage().getParameters().get('qid');
        Id templateId = (Id) ApexPages.currentPage().getParameters().get('tid');

        lineColumns = [
            SELECT
                Id,
                Name,
                SBQQ__Width__c,
                SBQQ__FieldName__c,
                SBQQ__Alignment__c
            FROM SBQQ__LineColumn__c
            WHERE
                SBQQ__Template__c = :templateId
                AND SBQQ__Section__r.Name = :sectionName
            ORDER BY SBQQ__DisplayOrder__c ASC
        ];
        List<String> fieldNames = getFieldNames();
        fieldNames.add('SBQQ__RequiredBy__c');

        String fields = String.join(fieldNames, ', ');

        Map<String, Object> lineColumnBinds = new Map<String, Object>{
            'quoteId' => quoteId,
            'renewableString' => 'Renewable'
        };

        Set<Id> parentLineIds = new Set<Id>();
        List<SBQQ__QuoteLine__c> topLevelQuoteLines = [
            SELECT Id
            FROM SBQQ__QuoteLine__c
            WHERE SBQQ__Quote__c = :quoteId AND SBQQ__Hidden__c = FALSE
            ORDER BY SBQQ__Number__c ASC
        ];
        for (SBQQ__QuoteLine__c parentQuoteLine : topLevelQuoteLines) {
            parentLineIds.add(parentQuoteLine.Id);
        }

        String query = 'SELECT ';
        query += fields;
        query += ' FROM SBQQ__QuoteLine__c WHERE SBQQ__Quote__c =: quoteId AND Paperwork_Product_Type__c =: renewableString AND SBQQ__Hidden__c = false ORDER BY SBQQ__Number__c ASC';

        quoteLines = (List<SBQQ__QuoteLine__c>) Database.queryWithBinds(
            query,
            lineColumnBinds,
            AccessLevel.USER_MODE
        );

        lineSummaries = new List<LineItemSummary>();

        processQuoteLines(quoteId);

        /*for (SBQQ__QuoteLine__c quoteLine : quoteLines) {
            lineSummaries.add(new LineItemSummary(quoteLine));
        }*/
    }

    private List<String> getFieldNames() {
        List<String> results = new List<String>();
        for (SBQQ__LineColumn__c lineColumn : lineColumns) {
            results.add(lineColumn.SBQQ__FieldName__c);
        }
        return results;
    }

    private void processQuoteLines(Id quoteId) {
        List<SBQQ__QuoteLine__c> quoteLines = [
            SELECT
                Id,
                Oracle_Code__c,
                SBQQ__ProductName__c,
                Initial_Term_Quantity__c,
                SBQQ__Description__c,
                Initial_Term_Amount__c,
                SBQQ__RequiredBy__c,
                Paperwork_Product_Type__c
            FROM SBQQ__QuoteLine__c
            WHERE 
                SBQQ__Quote__c =: quoteId 
                AND SBQQ__Hidden__c = FALSE
            ORDER BY SBQQ__Number__c ASC
        ];

        Map<Id, Id> ultimateParentMap = getUltimateParentIdMap(quoteLines);
        Map<Id, Decimal> initalTermAmountTotals = new Map<Id, Decimal>();

        for(SBQQ__QuoteLine__c quoteLine : quoteLines) {
            Id ultimateParentId = ultimateParentMap.get(quoteLine.Id);
            if(!initalTermAmountTotals.containsKey(ultimateParentId)) {
                initalTermAmountTotals.put(ultimateParentId, 0.0);
            }

            Decimal initialTermTotal = initalTermAmountTotals.get(ultimateParentId);
            initialTermTotal += quoteLine.Initial_Term_Amount__c;
            initalTermAmountTotals.put(ultimateParentId, initialTermTotal); 
        }

        List<String> currencyArgs = new List<String>{
            '0',
            'number',
            '###,###,##0.00'
        };

        for(SBQQ__QuoteLine__c quoteLine : quoteLines) {
            if(quoteLine.Paperwork_Product_Type__c != 'Renewable') {
                continue;
            }

            String amount = 'Included';

            if(initalTermAmountTotals.containsKey(quoteLine.Id)) {
                amount = quoteLine.CurrencyIsoCode +
                ' ' +
                String.format(
                    initalTermAmountTotals.get(quoteLine.Id).format(),
                    currencyArgs
                );
            }

            lineSummaries.add(new LineItemSummary(quoteLine, amount));
        }
    }

    private Map<Id, Decimal> getBundlePricesMap(
        List<SBQQ__QuoteLine__c> parentQuoteLines
    ) {
        Map<Id, Decimal> results = new Map<Id, Decimal>();
        for (SBQQ__QuoteLine__c quoteLine : parentQuoteLines) {
            Decimal totalBundleAmount = quoteLine.Initial_Term_Amount__c;
            for (
                SBQQ__QuoteLine__c childQuoteLine : quoteLine.SBQQ__Quote_Lines__r
            ) {
                if (childQuoteLine.Paperwork_Product_Type__c == 'Renewable') {
                    totalBundleAmount += childQuoteLine.Initial_Term_Amount__c;
                }
            }

            results.put(quoteLine.Id, totalBundleAmount);
        }
        return results;
    }

    private Map<Id, Id> getUltimateParentIdMap(List<SBQQ__QuoteLine__c> quoteLines) {
        Map<Id, Id> results = new Map<Id, Id>();

        for(SBQQ__QuoteLine__c quoteLine : quoteLines) {
            if(quoteLine.SBQQ__RequiredBy__c == null) {
                results.put(quoteLine.Id, quoteLine.Id);
                continue;
            }

            if(results.containsKey(quoteLine.SBQQ__RequiredBy__c)) {
                results.put(quoteLine.Id, results.get(quoteLine.SBQQ__RequiredBy__c));
            } else {
                results.put(quoteLine.Id, quoteLine.SBQQ__RequiredBy__c);
            }
        }

        return results;
    }

    private Map<SBQQ__QuoteLine__c, List<SBQQ__QuoteLine__c>> getChildLineItems(
        Set<Id> parentLineIds,
        Map<SBQQ__QuoteLine__c, List<SBQQ__QuoteLine__c>> quoteLinesHierarchy
    ) {
        Set<Id> childLineIds = new Set<Id>();
        if (quoteLinesHierarchy.isEmpty()) {
            //inital run
            //get parent quote lines first and use as main keys
            List<SBQQ__QuoteLine__c> parentQuoteLines = [
                SELECT
                    Id,
                    Oracle_Code__c,
                    SBQQ__ProductName__c,
                    Initial_Term_Quantity__c,
                    SBQQ__Description__c,
                    Initial_Term_Amount__c,
                    SBQQ__RequiredBy__c,
                    Paperwork_Product_Type__c,
                    (
                        SELECT
                            Id,
                            Oracle_Code__c,
                            SBQQ__ProductName__c,
                            Initial_Term_Quantity__c,
                            SBQQ__Description__c,
                            Initial_Term_Amount__c,
                            SBQQ__RequiredBy__c,
                            Paperwork_Product_Type__c
                        FROM SBQQ__Quote_Lines__r
                    )
                FROM SBQQ__QuoteLine__c
                WHERE Id IN :parentLineIds AND SBQQ__Hidden__c = FALSE
            ];

            for (SBQQ__QuoteLine__c quoteLine : parentQuoteLines) {
                if (!quoteLine.SBQQ__Quote_Lines__r.isEmpty()) {
                    quoteLinesHierarchy.put(
                        quoteLine,
                        quoteLine.SBQQ__Quote_Lines__r
                    );
                    for (
                        SBQQ__QuoteLine__c childQuoteLine : quoteLine.SBQQ__Quote_Lines__r
                    ) {
                        childLineIds.add(childQuoteLine.Id);
                    }
                }
            }
        }

        if (childLineIds.isEmpty()) {
            return quoteLinesHierarchy;
        } else {
            return getChildLineItems(childLineIds, quoteLinesHierarchy);
        }
    }

    public class LineItemSummary {
        public String productCode { get; set; }
        public String productName { get; set; }
        public String quantity { get; set; }
        public String description { get; set; }
        public String termPrice { get; set; }

        public LineItemSummary(SBQQ__QuoteLine__c quoteLine, String displayAmount) {
            
            this.productCode = quoteLine.Oracle_Code__c;
            this.productName = quoteLine.SBQQ__ProductName__c;
            this.quantity = quoteLine.Initial_Term_Quantity__c.format();
            this.description = quoteLine.SBQQ__Description__c;
            this.termPrice = displayAmount;
                
        }
    }
}