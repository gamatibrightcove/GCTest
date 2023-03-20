@isTest
public with sharing class Account6QAOppHandlerTest {
    @TestSetup
    private static void makeData() {
        Id customerRecordType = RecordTypeUtility.getId(
            Account.getSObjectType(),
            'Customer'
        );

        List<Account> accounts = new List<Account>{
            new Account(
                RecordTypeId = customerRecordType,
                Name = 'Account6QAOppHandlerTest Prospect',
                Account_Stage__c = 'Prospect'
            ),
            new Account(
                RecordTypeId = customerRecordType,
                Name = 'Account6QAOppHandlerTest Customer',
                Account_Stage__c = 'Customer'
            )
        };
        insert accounts;

        List<User> users = TestUserProvisioner.getNewUsers(2);
        insert users;

        List<AccountTeamMember> teamMembers = new List<AccountTeamMember>{
            new AccountTeamMember(
                AccountId = accounts[0].Id,
                UserId = users[0].Id,
                TeamMemberRole = 'BDR'
            ),
            new AccountTeamMember(
                AccountId = accounts[0].Id,
                UserId = users[1].Id,
                TeamMemberRole = 'Sales Rep'
            ),
            new AccountTeamMember(
                AccountId = accounts[1].Id,
                UserId = users[1].Id,
                TeamMemberRole = 'Sales Rep'
            )
        };
        insert teamMembers;
    }

    @isTest
    private static void testOppCreation() {
        Map<Id, Account> accounts = new Map<Id, Account>(
            [
                SELECT Id, X6QA__c, Account_Stage__c
                FROM Account
                WHERE X6QA__C = FALSE AND RecordType.Name = 'Customer'
            ]
        );
        for (Account account : accounts.values()) {
            account.X6QA__c = true;
        }

        Test.startTest();
        update accounts.values();
        Test.stopTest();

        List<Opportunity> opps = [
            SELECT
                Id,
                AccountId,
                Account_Stage_at_Creation__c,
                StageName,
                RecordType.Name,
                CloseDate,
                LeadSource
            FROM Opportunity
            WHERE AccountId IN :accounts.keySet()
        ];

        System.assertEquals(
            2,
            opps.size(),
            'No Opportunity records were created after the Accounts were marked as 6QA.'
        );

        for (Opportunity opp : opps) {
            System.assertEquals(
                '0 - Meeting Pending',
                opp.StageName,
                'Opportunity Stage not correctly set.'
            );
            System.assertEquals(
                'Lead',
                opp.RecordType.Name,
                'Opportunity Record Type not correctly set.'
            );
            System.assertEquals(
                Date.today().addDays(30),
                opp.CloseDate,
                'Opportunity Close Date not correctly set.'
            );
            System.assertEquals(
                'QA',
                opp.LeadSource,
                'Opportunity Lead Source was not correctly set.'
            );
        }
    }
}