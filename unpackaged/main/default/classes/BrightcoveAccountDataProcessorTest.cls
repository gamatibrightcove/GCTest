@isTest
public with sharing class BrightcoveAccountDataProcessorTest {
    @isTest
    static void testPost() {
        RestRequest request = new RestRequest();
        request.requestBody = Blob.valueOf(getRequestJson());
        RestContext.request = request;
        String responseJson = DataService.doPost();

        System.assertNotEquals(null, responseJson, 'Response was null.');

        Map<String, Object> response = (Map<String, Object>) JSON.deserializeUntyped(
            responseJson
        );

        System.assertEquals(
            true,
            (Boolean) response.get('success'),
            'Invocation was unsuccessful: ' + (String) response.get('message')
        );

        List<Brightcove_Account__c> brightAccounts = [
            SELECT Id, GUID__c
            FROM Brightcove_Account__c
            LIMIT 1
        ];
        System.assertEquals(
            1,
            brightAccounts.size(),
            'Incorrect number of records created.'
        );
    }

    static String getRequestJson() {
        Map<String, Object> requestMap = new Map<String, Object>{
            'requestName' => 'CreateBrightcoveAccounts',
            'data' => getDataMap()
        };

        return JSON.serialize(requestMap);
    }

    static Map<String, Object> getDataMap() {
        Map<String, SObjectField> fields = Brightcove_Account__c.getSObjectType()
            .getDescribe(SObjectDescribeOptions.DEFERRED)
            .fields.getMap();

        return new Map<String, Object>{
            'account_edition' => fields.get('Account_Edition__c')
                    .getDescribe()
                    .getPicklistValues()[0]
                .getValue(),
            'email_address' => 'BrightcoveAccountDataProcessorTest@example.com',
            'max_users' => 10,
            'account_profile' => fields.get('Account_Profile__c')
                    .getDescribe()
                    .getPicklistValues()[0]
                .getValue(),
            'publisher_status' => fields.get('Publisher_Status__c')
                    .getDescribe()
                    .getPicklistValues()[0]
                .getValue(),
            'tier' => fields.get('Tier__c').getDescribe().getPicklistValues()[0]
                .getValue(),
            'bc_account_id' => 'BrightcoveAccountDataProcess'
        };
    }
}