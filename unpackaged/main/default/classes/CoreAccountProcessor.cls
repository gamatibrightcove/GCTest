public with sharing class CoreAccountProcessor extends DataServiceProcessor {
    public override Map<String, Object> execute(Map<String, Object> dataMap) {
        Map<String, Object> responseMap = new Map<String, Object>{
            'success' => true
        };
        String requestType = (String) dataMap.get('RequestType');
        Map<String, Object> dataObjMap = (Map<String, Object>) dataMap.get(
            'Data'
        );

        Core_Account__c coreAccount = new Core_Account__c();

        try {
            super.setValues(coreAccount, dataObjMap);
            insert coreAccount;
        } catch (Exception e) {
            responseMap.put('success', false);
            responseMap.put('error', e.getMessage());
        }

        return responseMap;
    }
}