@isTest
public with sharing class ContactAccountEmailDomainHandlerTest {
    @TestSetup
    static void makeData() {
        Account account = new Account(
            Name = 'ContactAccountEmailDomainHandlerTest'
        );
        insert account;
    }

    @isTest
    private static void testSetEmailDomain() {
        Account account = [
            SELECT Id
            FROM Account
            WHERE Email_Domain_Name__c = NULL
            LIMIT 1
        ];
        Contact contact = new Contact(
            LastName = 'ContactAccountEmailDomainHandlerTest',
            Email = 'ContactAccountEmailDomainHandlerTest@example.com',
            AccountId = account.Id
        );

        Test.startTest();
        insert contact;
        Test.stopTest();
        contact = [
            SELECT Id, Email_Address_Domain__c
            FROM Contact
            WHERE Id = :contact.Id
        ];
        account = [
            SELECT Id, Email_Domain_Name__c
            FROM Account
            WHERE Id = :account.Id
        ];

        System.assertEquals(
            contact.Email_Address_Domain__c,
            account.Email_Domain_Name__c,
            'Account Email Domain Name not correctly set from new Contact.'
        );
    }
}