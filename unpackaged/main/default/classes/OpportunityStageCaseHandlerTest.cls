@isTest
public with sharing class OpportunityStageCaseHandlerTest {
    @TestSetup
    static void createDataSet() {
        TestUserProvisioner provisioner = new TestUserProvisioner(
            UserInfo.getUserId()
        );

        provisioner.setLicenses(
            new List<String>{
                'SalesforceCPQ_CPQStandardPerm',
                'SalesforceCPQ_CPQAAPerm'
            }
        );
        provisioner.setPermissions(
            new List<String>{
                'Approvals_Global',
                'CPQ_Global',
                'Order_Contract_an_Order',
                'Global_Read',
                'SteelBrickCPQUser',
                'AdvancedApprovalsUser'
            }
        );
        provisioner.assignPermissions();
        List<Account> accountSet = new List<Account>();

        Id accountRecordType = RecordTypeUtility.getid(
            Account.getSObjectType(),
            'Customer'
        );

        for (Integer i = 0; i < 3; i++) {
            Account account = new Account();
            account.Account_Stage__c = 'Prospect';
            account.Name = 'TestCase ' + i;
            account.RecordTypeId = accountRecordType;
            accountSet.add(account);
        }

        insert accountSet;

        List<Opportunity> opportunitySet = new List<Opportunity>();

        for (Account account : accountSet) {
            opportunitySet.add(OpportunityTestFactory.getStage1Opp(account.Id));
        }

        insert opportunitySet;
    }

    @isTest
    static void testOpportunityClosedWon() {
        Id opportunityRecordType = RecordTypeUtility.getid(
            Opportunity.getSObjectType(),
            'New Business'
        );

        List<Account> accountSet = [
            SELECT
                Id,
                Name,
                (
                    SELECT Id, StageName
                    FROM Opportunities
                    WHERE
                        IsClosed = FALSE
                        AND RecordTypeId = :opportunityRecordType
                )
            FROM Account
            WHERE Name LIKE 'TestCase_%'
        ];

        List<Opportunity> opportunitySet = new List<Opportunity>();
        SBQQ.TriggerControl.disable();
        Test.startTest();

        for (Account account : accountSet) {
            for (Opportunity opportunityRec : account.Opportunities) {
                OpportunityTestFactory.closeWin(opportunityRec);
                opportunitySet.add(opportunityRec);
            }
        }

        update opportunitySet;

        Test.stopTest();

        List<Case> caseSet = new List<Case>();
        caseSet = [
            SELECT Id, Origin, Type
            FROM Case
            WHERE AccountId IN :accountSet
        ];

        for (Case c : caseSet) {
            System.assertEquals(
                'Automated Task',
                c.Type,
                'Cases not created with the right type'
            );
            System.assertEquals(
                'System',
                c.Origin,
                'Cases not created with the right type'
            );
        }
    }
}