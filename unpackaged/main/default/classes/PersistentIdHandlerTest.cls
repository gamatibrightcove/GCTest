@isTest
public with sharing class PersistentIdHandlerTest {
    @isTest
    private static void testGuidAssignment() {
        Account account = new Account(Name = 'PersistentIdHandlerTest');
        insert account;

        account = [SELECT Id, GUID__c FROM Account WHERE Id = :account.Id];

        System.assertNotEquals(
            null,
            account.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            account.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }
}
