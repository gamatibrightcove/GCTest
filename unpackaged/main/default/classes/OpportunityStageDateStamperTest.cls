@isTest
public with sharing class OpportunityStageDateStamperTest {
    @TestSetup
    static void makeData() {
        List<Account> accounts = new List<Account>();
        Id customerRecordType = RecordTypeUtility.getId(
            Account.getSObjectType(),
            'Customer'
        );
        for (Integer i = 0; i < 3; i++) {
            accounts.add(
                new Account(
                    RecordTypeId = customerRecordType,
                    Name = 'OpportunityStageDateStamperTest' + String.valueOf(i)
                )
            );
        }
        insert accounts;
    }

    @isTest
    private static void testStampStagedDateOnInsert() {
        Account account = [
            SELECT Id
            FROM Account
            WHERE Name LIKE 'OpportunityStageDateStamperTest%'
            LIMIT 1
        ];
        Opportunity opp = OpportunityTestFactory.getStage1Opp(account.Id);
        insert opp;

        opp = [
            SELECT Id, Discovery_Stage_Set_Date__c
            FROM Opportunity
            WHERE Id = :opp.Id
        ];

        System.assertEquals(
            true,
            opp.Discovery_Stage_Set_Date__c != null,
            'Discovery Stage Set Date field was not stamped.'
        );

        Datetime actual = opp.Discovery_Stage_Set_Date__c;
        Datetime expected = Datetime.now();

        System.assertEquals(
            true,
            actual <= expected,
            'Datetime value was not correctly set'
        );
    }

    @isTest
    private static void testStampStagedDateOnUpdate() {
        List<Account> accounts = [
            SELECT Id
            FROM Account
            WHERE Name LIKE 'OpportunityStageDateStamperTest%'
        ];
        Map<String, SObjectField> stageFieldMap = OpportunityStageDateStamper.stageFieldMap;

        List<Opportunity> opps = new List<Opportunity>{
            OpportunityTestFactory.getStage1Opp(accounts[0].Id),
            OpportunityTestFactory.getStage2Opp(accounts[1].Id),
            OpportunityTestFactory.getStage3Opp(accounts[2].Id)
        };
        upsert opps;

        OpportunityTestFactory.setStage2(opps[0]);
        OpportunityTestFactory.setStage3(opps[1]);
        OpportunityTestFactory.setStage4(opps[2]);
        update opps;

        opps = [
            SELECT
                Id,
                StageName,
                Demo_Stage_Set_Date__c,
                Solution_Design_Stage_Set_Date__c,
                Negotiation_Stage_Set_Date__c
            FROM Opportunity
            WHERE Id IN :opps
        ];

        for (Opportunity opp : opps) {
            SObjectField stageDateField = stageFieldMap.get(opp.StageName);
            System.assertEquals(
                true,
                opp.get(stageDateField) != null,
                'Discovery Stage Set Date field was not stamped.'
            );

            Datetime actual = (Datetime) opp.get(stageDateField);
            Datetime expected = Datetime.now();

            System.assertEquals(
                true,
                actual <= expected,
                'Datetime value was not correctly set'
            );
        }
    }
}