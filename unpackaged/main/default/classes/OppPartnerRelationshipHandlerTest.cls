@isTest
public with sharing class OppPartnerRelationshipHandlerTest {
    @TestSetup
    static void testDataSetup() {
        Map<String, RecordTypeInfo> accountRecordTypes = Account.getSObjectType()
            .getDescribe(SObjectDescribeOptions.DEFERRED)
            .getRecordTypeInfosByName();

        insert new List<Account>{
            new Account(
                Name = 'Customer',
                RecordTypeId = accountRecordTypes.get('Customer')
                    .getRecordTypeId()
            ),
            new Account(
                Name = 'Partner 1',
                RecordTypeId = accountRecordTypes.get('Partner')
                    .getRecordTypeId()
            ),
            new Account(
                Name = 'Partner 2',
                RecordTypeId = accountRecordTypes.get('Partner')
                    .getRecordTypeId()
            ),
            new Account(
                Name = 'Partner 3',
                RecordTypeId = accountRecordTypes.get('Partner')
                    .getRecordTypeId()
            )
        };
    }

    @isTest
    static void testPartnerRelationship() {
        List<Account> accounts = [
            SELECT Id
            FROM Account
            WHERE RecordType.Name IN ('Customer', 'Partner')
            ORDER BY RecordType.Name
        ];
        Account customer = accounts[0];
        Account partner1 = accounts[accounts.size() - 1];
        Account partner2 = accounts[accounts.size() - 2];
        Account partner3 = accounts[accounts.size() - 3];

        List<Opportunity> opps = new List<Opportunity>{
            new Opportunity(
                AccountId = customer.Id,
                Partner__c = partner1.Id,
                Partner_Type__c = 'Transactional',
                StageName = 'Proposal',
                CloseDate = Date.today()
            ),
            new Opportunity(
                AccountId = customer.Id,
                StageName = 'Proposal',
                CloseDate = Date.today()
            ),
            new Opportunity(
                AccountId = customer.Id,
                StageName = 'Proposal',
                CloseDate = Date.today()
            )
        };
        insert opps;

        Test.startTest();

        opps = [
            SELECT Id, Name, Partner__c, Partner_Type__c, AccountId
            FROM Opportunity
            ORDER BY Partner__r.Name NULLS LAST
        ];

        List<Partner_Relationship__c> partnerRelationships = [
            SELECT
                Id,
                Customer_Account__c,
                Partner_Account__c,
                Type__c,
                Active__c
            FROM Partner_Relationship__c
            WHERE Customer_Account__c = :customer.Id
        ];

        System.assertEquals(
            1,
            partnerRelationships.size(),
            'Incorrect number of Partner Relationship records created.'
        );
        System.assertEquals(
            opps[0].Partner__c,
            partnerRelationships[0].Partner_Account__c,
            'Incorrect Partner assigned to Partner Relationship record'
        );
        System.assertEquals(
            opps[0].Partner_Type__c,
            partnerRelationships[0].Type__c,
            'Incorrect Partner Type assigned to Partner Relationship record'
        );
        System.assertEquals(
            true,
            partnerRelationships[0].Active__c,
            'Partner Relationship record not created as Active.'
        );

        opps[0].Partner__c = partner3.Id;
        opps[0].Partner_Type__c = 'Transactional';
        opps[1].Partner__c = partner2.Id;
        opps[1].Partner_Type__c = 'Transactional';
        update opps;

        Test.stopTest();

        partnerRelationships = [
            SELECT
                Id,
                Customer_Account__c,
                Partner_Account__c,
                Type__c,
                Active__c,
                Partner_Account__r.Name
            FROM Partner_Relationship__c
            WHERE Customer_Account__c = :customer.Id
            ORDER BY Partner_Account__r.Name
        ];

        System.assertEquals(
            3,
            partnerRelationships.size(),
            'Incorrect number of Partner Relationship records created.'
        );

        System.assertEquals(
            opps[0].Partner__c,
            partnerRelationships[0].Partner_Account__c,
            'Incorrect Partner assigned to Partner Relationship record'
        );
        System.assertEquals(
            opps[0].Partner_Type__c,
            partnerRelationships[0].Type__c,
            'Incorrect Partner Type assigned to Partner Relationship record'
        );
        System.assertEquals(
            true,
            partnerRelationships[0].Active__c,
            'Partner Relationship record not created as Active.'
        );

        opps[2].Partner__c = partner2.Id;
        opps[2].Partner_Type__c = 'Transactional';
        update opps;

        partnerRelationships = [
            SELECT Id
            FROM Partner_Relationship__c
            WHERE Customer_Account__c = :customer.Id
        ];

        System.assertEquals(
            3,
            partnerRelationships.size(),
            'Incorrect number of Partner Relationship records created.'
        );
    }
}
