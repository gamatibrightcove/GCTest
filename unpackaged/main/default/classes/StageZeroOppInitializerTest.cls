@isTest
public with sharing class StageZeroOppInitializerTest {
    @TestSetup
    static void makeData() {
        insert new Account(
            Name = 'StageZeroOppInitializerTest',
            Account_Stage__c = 'Prospect',
            RecordTypeId = RecordTypeUtility.getId(
                Account.getSObjectType(),
                'Customer'
            ),
            X6sense_Account_6QA_End_Date__c = Date.today().addDays(-1),
            X6sense_Account_6QA_Start_Date__c = Date.today().addDays(-2),
            X6sense_Account_Buying_Stage__c = 'Definitely buying',
            X6sense_Account_Intent_Score__c = 123,
            X6sense_Account_Profile_Fit__c = 'Nice fit',
            X6sense_Account_Reach_Score__c = 456,
            X6Sense_Segment_Name__c = 'Nice segment my friend',
            X6sense_Stage_Awareness__c = Date.today().addDays(-4),
            X6sense_Stage_Consideration__c = Date.today().addDays(-3),
            X6sense_Stage_Decision__c = Date.today().addDays(-2),
            X6sense_Stage_Purchase__c = Date.today().addDays(-1),
            Named_Account__c = true,
            Named_Account_Tier__c = 'Tier 1'
        );
    }

    @isTest
    static void testStageZeroOppCreation() {
        Account account = [
            SELECT Id, X6QA__c
            FROM Account
            WHERE Name = 'StageZeroOppInitializerTest'
        ];
        account.X6QA__c = true;
        Id accountId = account.Id;

        update account;

        List<String> fields = new List<String>{
            'X6QA__c',
            'X6sense_Account_6QA_End_Date__c',
            'X6sense_Account_6QA_Start_Date__c',
            'X6sense_Account_Buying_Stage__c',
            'X6sense_Account_Intent_Score__c',
            'X6sense_Account_Profile_Fit__c',
            'X6sense_Account_Reach_Score__c',
            'X6Sense_Segment_Name__c',
            'X6sense_Stage_Awareness__c',
            'X6sense_Stage_Consideration__c',
            'X6sense_Stage_Decision__c',
            'X6sense_Stage_Purchase__c',
            'Named_Account__c',
            'Named_Account_Tier__c'
        };

        List<Opportunity> opps = Database.query(
            'SELECT Id, Account_Stage_at_Creation__c, ' +
            String.join(fields, ', ') +
            ' FROM Opportunity WHERE AccountId = :accountId AND RecordType.Name =\'Lead\''
        );

        System.assertEquals(
            1,
            opps.size(),
            'Incorrect number of Opportunity records created.'
        );

        account = (Account) Database.query(
            'SELECT Id, Account_Stage__c, ' +
            String.join(fields, ', ') +
            ' FROM Account WHERE Id = :accountId'
        );

        System.assertEquals(
            account.Account_Stage__c,
            opps[0].Account_Stage_at_Creation__c,
            'Account Stage at Creation not correctly set on Opportunity'
        );
        for (String field : fields) {
            Object expected = account.get(field);
            Object actual = opps[0].get(field);
            System.assertEquals(
                expected,
                actual,
                'Incorrect value set on Opportunity for field: ' + field
            );
        }
    }
}