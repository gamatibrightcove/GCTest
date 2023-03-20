public with sharing class BrightcoveAccountDataProcessor extends DataServiceProcessor {
    Map<String, Object> dataObjMap;
    Map<String, Object> responseMap = new Map<String, Object>{
        'success' => true
    };
    Map<String, Object> responseData = new Map<String, Object>();

    public override Map<String, Object> execute(
        Map<String, Object> dataObjMap
    ) {
        this.dataObjMap = dataObjMap;

        Brightcove_Account__c brightcoveAccount = getRecord();

        super.setValues(brightcoveAccount, dataObjMap);
        upsert brightcoveAccount;
        brightcoveAccount = [
            SELECT GUID__c
            FROM Brightcove_Account__c
            WHERE Id = :brightcoveAccount.Id
        ];
        responseData.put('guid', brightcoveAccount.GUID__c);
        responseMap.put('data', responseData);

        return responseMap;
    }

    public Brightcove_Account__c getRecord() {
        if (dataObjMap.containsKey('guid')) {
            return (Brightcove_Account__c) super.getRecord(
                (String) dataObjMap.get('guid')
            );
        }

        return new Brightcove_Account__c();
    }
}