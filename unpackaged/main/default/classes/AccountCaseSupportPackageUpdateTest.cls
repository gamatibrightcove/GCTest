@IsTest
public with sharing class AccountCaseSupportPackageUpdateTest {
    @TestSetup
    static void testData() {
        List<Account> accountSet = new List<Account>();

        Id accountRecordType = RecordTypeUtility.getid(
            Account.getSObjectType(),
            'Customer'
        );

        for (Integer i = 0; i < 3; i++) {
            Account accountRec = new Account();
            accountRec.RecordTypeId = accountRecordType;
            accountRec.Name = 'Package' + i;
            accountRec.Support_package__c = 'Silver';

            accountSet.add(accountRec);
        }
        insert accountSet;

        List<Case> caseSet = new List<Case>();
        Id technicalSupportRecordType = RecordTypeUtility.getid(
            Case.getSObjectType(),
            'Technical Support'
        );

        for (Account accountRec : accountSet) {
            Case caseRec = new Case();
            caseRec.AccountId = accountRec.Id;
            caseRec.RecordTypeId = technicalSupportRecordType;
            caseRec.Status = 'New';
            caseRec.Support_Package__c = accountRec.Support_package__c;
            caseSet.add(caseRec);
        }
        insert caseSet;
    }

    @isTest
    static void processTest() {
        List<Account> accountSet = [
            SELECT Id, Support_Package__c
            FROM Account
            WHERE Name LIKE 'Package%'
        ];

        Test.startTest();
        for (Account accountRec : accountSet) {
            accountRec.Support_package__c = 'Platinum';
        }
        update accountSet;

        Test.stopTest();

        List<Case> caseSet = [
            SELECT Id, AccountId, Support_Package__c, Account.Support_package__c
            FROM Case
            WHERE IsClosed = FALSE AND AccountId IN :accountSet
        ];

        for (Case caseRec : caseSet) {
            System.assertEquals(
                'Platinum',
                caseRec.Support_Package__c,
                'Not all the open cases got the support package updated'
            );
        }
    }
}