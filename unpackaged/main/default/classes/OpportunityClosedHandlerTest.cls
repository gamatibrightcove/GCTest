@isTest
public with sharing class OpportunityClosedHandlerTest {
    @TestSetup
    static void makeData() {
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

        List<Account> accounts = new List<Account>{
            new Account(Name = 'OpportunityClosedLostHandlerTest 1'),
            new Account(Name = 'OpportunityClosedLostHandlerTest 2')
        };
        insert accounts;
        Opportunity stageZeroOpp = OpportunityTestFactory.getStageZeroOpp();
        Opportunity stageOneOppToWin = OpportunityTestFactory.getStage4Opp(
            accounts[0].Id
        );
        Opportunity stageOneOppToLose = OpportunityTestFactory.getStage1Opp(
            accounts[1].Id
        );
        stageOneOppToLose.RecordTypeId = RecordTypeUtility.getId(
            Opportunity.getSObjectType(),
            'Add-On'
        );
        List<Opportunity> opps = new List<Opportunity>{
            stageZeroOpp,
            stageOneOppToWin,
            stageOneOppToLose
        };
        upsert opps;
    }

    @isTest
    static void testRecyleContacts() {
        List<Opportunity> opps = [
            SELECT Id, StageName, ContactId
            FROM Opportunity
            WHERE IsClosed = FALSE
            ORDER BY RecordType.Name
        ];

        opps[0].StageName = 'Closed Lost';
        OpportunityTestFactory.disqualifyStageZeroOpp(opps[1]);
        OpportunityTestFactory.closeWin(opps[2]);

        SBQQ.TriggerControl.disable();

        Test.startTest();
        update opps;
        Test.stopTest();

        List<Id> contactIds = new List<Id>{
            opps[0].ContactId,
            opps[1].ContactId,
            opps[2].ContactId
        };
        List<Contact> contacts = [
            SELECT Id, Stage__c
            FROM Contact
            WHERE Id IN :contactIds
        ];
        for (Contact contact : contacts) {
            System.assertEquals(
                'Recycled',
                contact.Stage__c,
                'Contact Stage was not set to "Recycled"'
            );
        }
    }
}