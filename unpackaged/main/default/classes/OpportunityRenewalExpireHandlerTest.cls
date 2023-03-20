@IsTest
public with sharing class OpportunityRenewalExpireHandlerTest {
    @TestSetup
    static void setupData() {
        Id renewalRecordType = RecordTypeUtility.getId(
            Opportunity.getSObjectType(),
            'Renewal'
        );
        Id customerRecordType = RecordTypeUtility.getId(
            Account.getSObjectType(),
            'Customer'
        );

        Account account = new Account(
            Name = 'OpportunityRenewalExpireHandlerTest',
            RecordTypeId = customerRecordType
        );

        insert account;

        Contract contract = new Contract(
            AccountId = account.Id,
            StartDate = Date.today().addYears(-1).addDays(-1),
            ContractTerm = 12,
            Status = 'Draft'
        );

        insert contract;

        Opportunity opp = OpportunityTestFactory.getStage4Opp(account.Id, renewalRecordType);
        opp.SBQQ__RenewedContract__c = contract.Id;
        update opp;
    }

    @IsTest
    public static void testExpiration() {
        Account account = [
            SELECT
                Id,
                (SELECT Id, Status FROM Contracts),
                (
                    SELECT Id, StageName
                    FROM Opportunities
                    WHERE
                        RecordType.Name = 'Renewal'
                )
            FROM Account
            WHERE Name = 'OpportunityRenewalExpireHandlerTest'
            LIMIT 1
        ];

        Contract oldContract = account.Contracts[0];
        Opportunity renewalOpp = account.Opportunities[0];

        oldContract.Status = 'Activated';
        update oldContract;

        System.assertEquals(
            'Activated',
            oldContract.Status,
            'Old contract is not activated when it should be'
        );

        //disabling CPQ triggers since the only funtionality to test is whether the contract is updated
        SBQQ.TriggerControl.disable();
        Test.startTest();

        OpportunityTestFactory.closeWin(renewalOpp);
        update renewalOpp;

        Test.stopTest();
        SBQQ.TriggerControl.enable();

        oldContract = [
            SELECT Id, Status
            FROM Contract
            WHERE Id = :oldContract.Id
        ];

        System.assertEquals(
            'Expired',
            oldContract.Status,
            'Old contract is not expired when it should be'
        );
    }
}