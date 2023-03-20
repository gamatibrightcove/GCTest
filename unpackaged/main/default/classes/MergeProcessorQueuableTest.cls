@IsTest
public with sharing class MergeProcessorQueuableTest {
    @TestSetup
    private static void makeData() {
        User apiUser = [
            SELECT Id
            FROM User
            WHERE IsActive = TRUE AND Email LIKE 'salesforce@brightcove.com%'
            LIMIT 1
        ];

        System.runAs(apiUser) {
            List<Account> accounts = new List<Account>{
                new Account(
                    Name = 'MergeProcessorQueuableTest1',
                    Account_Stage__c = 'Customer',
                    D_U_N_S_Number__c = '123456',
                    OwnerId = apiUser.Id
                ),
                new Account(
                    Name = 'MergeProcessorQueuableTest2',
                    Account_Stage__c = 'Prospect',
                    D_U_N_S_Number__c = '123456',
                    OwnerId = apiUser.Id
                ),
                new Account(
                    Name = 'MergeProcessorQueuableTest2',
                    Account_Stage__c = 'Prospect',
                    D_U_N_S_Number__c = '123456',
                    OwnerId = apiUser.Id
                )
            };
            insert accounts;

            List<Contact> contacts = new List<Contact>();
            for (Account account : accounts) {
                contacts.add(
                    new Contact(
                        LastName = 'MergeProcessorQueuableTest',
                        Email = 'MergeProcessorQueuableTest@example.com',
                        OwnerId = apiUser.Id
                    )
                );
            }
            insert contacts;

            User portalUser = TestUserProvisioner.getNewUser();
            portalUser.ContactId = contacts[0].Id;
            portalUser.ProfileId = [
                SELECT Id
                FROM Profile
                WHERE Name = 'BrightSpot Community Login User'
            ]
            .Id;
            insert portalUser;
        }
    }

    @isTest
    private static void testAccountsExecute() {
        Account expectedPrimary = [
            SELECT Id
            FROM Account
            WHERE
                Name = 'MergeProcessorQueuableTest1'
                AND Account_Stage__c = 'Customer'
            LIMIT 1
        ];
        Test.startTest();
        System.enqueueJob(new MergeProcessorQueuable());
        Test.stopTest();

        List<Account> accounts = [
            SELECT Id, Name, Account_Stage__c
            FROM Account
            WHERE D_U_N_S_Number__c = '123456'
        ];
        System.assertEquals(
            1,
            accounts.size(),
            'Accounts where not correctly merged.'
        );

        System.assertEquals(
            expectedPrimary.Id,
            accounts[0].Id,
            'Incorrect Account was designated as the Primary.'
        );
    }

    @isTest
    private static void testContactsExecute() {
        Id expectedPrimaryId = [
            SELECT Id, ContactId
            FROM User
            WHERE Contact.Name = 'MergeProcessorQueuableTest'
            LIMIT 1
        ]
        .Id;
        Test.startTest();
        System.enqueueJob(new ContactMergerQueueable());
        Test.stopTest();

        List<Contact> contacts = [
            SELECT Id
            FROM Contact
            WHERE Email = 'MergeProcessorQueuableTest@example.com'
        ];
        System.assertEquals(1, contacts.size(), 'Contacts were not merged.');
        System.assertEquals(
            expectedPrimaryId,
            contacts[0].Id,
            'Incorrect Contact was designated as the Primary.'
        );
    }
}