public with sharing class DefaultDataServiceRetriever extends DataServiceProcessor {
    private Map<String, Object> responseMap = new Map<String, Object>();
    private Map<String, Object> requestDataMap;

    public override Map<String, Object> execute(
        Map<String, Object> requestDataMap
    ) {
        this.requestDataMap = requestDataMap;
        setResult();
        return responseMap;
    }

    private void setResult() {
        List<SObject> results = Database.query(
            String.format(
                getQuery(),
                new List<String>{
                    getDelimitedQueryFields(),
                    super.getSObjectName()
                }
            )
        );
        if (results.isEmpty()) {
            responseMap.put('success', false);
            responseMap.put('message', 'No record found for provided value.');
            return;
        }

        responseMap.put('success', true);
        responseMap.put('data', results);
    }

    private String getQuery() {
        return 'SELECT {0} FROM {1} WHERE ' +
            String.escapeSingleQuotes(super.getIdField()) +
            ' = \'' +
            (String) requestDataMap.get('guid') +
            '\'';
    }

    private String getDelimitedQueryFields() {
        List<String> queryFields = new List<String>();
        for (API_Mapping__mdt mapping : super.getMappings()) {
            queryFields.add(mapping.Source__c);
        }

        return String.join(queryFields, ', ');
    }
}