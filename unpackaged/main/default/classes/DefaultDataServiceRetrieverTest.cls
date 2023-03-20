@isTest
public with sharing class DefaultDataServiceRetrieverTest {
    @TestSetup
    static void makeData() {
        Brightcove_Account__c brightAccount = new Brightcove_Account__c(
            GUID__c = GuidUtility.generateGuid(),
            Brightcove_Account_Id__c = '12345',
            Account_Profile__c = Brightcove_Account__c.Account_Profile__c.getDescribe()
                    .getPicklistValues()[0]
                .getValue(),
            Email_Address__c = 'DefaultDataServiceRetrieverTest@example.com'
        );
        insert brightAccount;
    }

    @isTest
    private static void testGetBrightcoveAccount() {
        Brightcove_Account__c brightcoveAccount = [
            SELECT Id, GUID__c
            FROM Brightcove_Account__c
            LIMIT 1
        ];
        System.assertNotEquals(
            null,
            brightcoveAccount.GUID__c,
            'Test record does not have a GUID value.'
        );

        RestRequest req = new RestRequest();
        req.params.put('guid', brightcoveAccount.GUID__c);
        req.params.put('requestName', 'GetBrightcoveAccount');
        req.httpMethod = 'GET';

        RestContext.request = req;
        String responseJson = DataService.doGet();

        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(
            responseJson
        );

        System.assertEquals(
            true,
            (Boolean) responseMap.get('success'),
            'The response did not indicated success'
        );
    }

    @isTest
    private static void testGetEmptyResult() {
        RestRequest req = new RestRequest();
        req.params.put('guid', 'InvalidGuid');
        req.params.put('requestName', 'GetBrightcoveAccount');
        req.httpMethod = 'GET';

        RestContext.request = req;
        String responseJson = DataService.doGet();

        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(
            responseJson
        );

        System.assertEquals(
            false,
            (Boolean) responseMap.get('success'),
            'The response indicated success.'
        );

        System.assertEquals(
            'No record found for provided value.',
            (String) responseMap.get('message'),
            'Incorrect error message in response.'
        );
    }
}