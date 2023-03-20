@isTest
public with sharing class ContactStamperTest {
    @TestSetup
    private static void makeData() {
        insert new Account(Name = 'ContactStamperTest');
    }

    @isTest
    private static void testStamp() {
        Account account = [
            SELECT Id
            FROM Account
            WHERE Name = 'ContactStamperTest'
            LIMIT 1
        ];
        List<PicklistEntry> stages = Contact.Stage__c.getDescribe()
            .getPicklistValues();
        Contact testContact = new Contact(
            LastName = 'ContactStamperTest',
            FirstName = 'Test',
            AccountId = account.Id,
            Stage__c = stages[0].getValue(),
            Email = 'test@ContactStamperTest.com'
        );
        insert testContact;

        testContact = [
            SELECT Id, Stage_Date__c, Is_Rejected__c, Rejected_Date__c
            FROM Contact
            WHERE Id = :testContact.Id
        ];

        System.assertEquals(
            Date.today(),
            testContact.Stage_Date__c,
            'Stage Date not correctly set.'
        );
        System.assertEquals(
            null,
            testContact.Rejected_Date__c,
            'Rejected Date incorrectly set.'
        );

        testContact.Is_Rejected__c = true;
        testContact.Rejected_Reason__c = Contact.Rejected_Reason__c.getDescribe()
                .getPicklistValues()[0]
            .getValue();

        update testContact;

        testContact = [
            SELECT Id, Rejected_Date__c
            FROM Contact
            WHERE Id = :testContact.Id
        ];

        System.assertEquals(
            Date.today(),
            testContact.Rejected_Date__c,
            'Stage Date not correctly set.'
        );
    }
}