@isTest
public class OpportunityStageAccountHandlerTest {
    @testSetup
    static void createDataSet() {
        Id customerRecordType = RecordTypeUtility.getId(
            Account.getSObjectType(),
            'Customer'
        );
        Id newBusinessRecordType = RecordTypeUtility.getId(
            Opportunity.getSObjectType(),
            'New Business'
        );
        Id renewalRecordType = RecordTypeUtility.getId(
            Opportunity.getSObjectType(),
            'Renewal'
        );

        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 3; i++) {
            accounts.add(
                new Account(
                    Name = 'Prospect ' + String.valueOf(i),
                    Account_Stage__c = 'Prospect',
                    RecordTypeId = customerRecordType
                )
            );

            accounts.add(
                new Account(
                    Name = 'Customer + ' + String.valueOf(i),
                    Account_Stage__c = 'Customer',
                    RecordTypeId = customerRecordType
                )
            );
        }
        insert accounts;

        SBQQ__Quote__c quote = new SBQQ__Quote__c(SBQQ__Status__c = 'Draft');
        insert quote;

        List<Opportunity> opps = new List<Opportunity>();
        for (Account account : accounts) {
            Id recordTypeId = account.Account_Stage__c == 'Prospect'
                ? newBusinessRecordType
                : renewalRecordType;
            opps.add(
                OpportunityTestFactory.getStage1Opp(account.Id, recordTypeId)
            );
        }

        insert opps;
    }

    @isTest
    static void testClosedWonOpportunities() {
        List<Opportunity> opps = [
            SELECT Id, StageName, AccountId
            FROM Opportunity
            WHERE Account.Account_Stage__c = 'Prospect' AND IsClosed = FALSE
        ];

        SBQQ__Quote__c quote = [SELECT Id FROM SBQQ__Quote__c LIMIT 1];

        List<Id> accountIds = new List<Id>();
        for (Opportunity opportunity : opps) {
            opportunity.StageName = 'Closed Won';
            accountIds.add(opportunity.AccountId);
        }

        SBQQ.TriggerControl.disable();
        Test.startTest();

        update opps;

        Test.stopTest();
        SBQQ.TriggerControl.enable();

        //Let's check the accounts.
        List<Account> accounts = [
            SELECT Id, Account_Stage__c
            FROM Account
            WHERE Id = :accountIds
        ];

        for (Account account : accounts) {
            System.assertEquals(
                'Customer',
                account.Account_Stage__c,
                'The account stage was not correctly updated from Prospect to Customer.'
            );
        }
    }

    @isTest
    static void testClosedLostOpportunities() {
        List<Opportunity> opps = [
            SELECT Id, StageName, AccountId
            FROM Opportunity
            WHERE Account.Account_Stage__c = 'Customer' AND IsClosed = FALSE
        ];

        List<Id> accountIds = new List<Id>();
        for (Opportunity opp : opps) {
            accountIds.add(opp.AccountId);
            opp.StageName = 'Closed Lost';
        }

        Test.startTest();

        update opps;

        Test.stopTest();

        /* Verify all the accounts are lost */
        List<Account> accounts = [
            SELECT Id, Account_Stage__c
            FROM Account
            WHERE Id = :accountIds
        ];

        for (Account account : accounts) {
            System.assertEquals(
                'Former',
                account.Account_Stage__c,
                'The account stage was not correctly updated from Customer to Former.'
            );
        }
    }
}