@isTest
public with sharing class OpportunityTestFactory {
    private static Id newBusinessRecordTypeId = RecordTypeUtility.getId(
        Opportunity.getSObjectType(),
        'New Business'
    );
    private static Id leadRecordTypeId = RecordTypeUtility.getId(
        Opportunity.getSObjectType(),
        'Lead'
    );

    public static List<Opportunity> getStageZeroOpps(Integer count) {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < count; i++) {
            accounts.add(
                new Account(
                    Name = 'OpportunityTestFactory Stage Zero ' +
                        String.valueOf(i + 1),
                    RecordTypeId = RecordTypeUtility.getId(
                        Account.getSObjectType(),
                        'Customer'
                    )
                )
            );
        }
        insert accounts;

        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < count; i++) {
            contacts.add(
                new Contact(
                    LastName = 'getStageZeroOpps' + String.valueOf(i),
                    Email = 'getStageZeroOpps' +
                        String.valueOf(i) +
                        '@example.com',
                    AccountId = accounts[i].Id
                )
            );
        }
        insert contacts;

        List<Opportunity> opps = new List<Opportunity>();
        for (Integer i = 0; i < count; i++) {
            opps.add(
                new Opportunity(
                    Name = 'Irrelevant',
                    RecordTypeId = leadRecordTypeId,
                    StageName = '0 - Meeting Pending',
                    AccountId = accounts[i].Id,
                    ContactId = contacts[i].Id,
                    CloseDate = Date.today().addDays(30),
                    Forecast__c = 'Omitted'
                )
            );
        }
        return opps;
    }

    public static Opportunity getStageZeroOpp() {
        return getStageZeroOpps(1)[0];
    }

    public static void disqualifyStageZeroOpp(Opportunity opp) {
        opp.StageName = '0 - Disqualified';
        opp.Qualified_Out_Reason__c = Opportunity.Qualified_Out_Reason__c.getDescribe()
                .getPicklistValues()[0]
            .getValue();
    }

    public static void setStage2(Opportunity opp) {
        createPrimaryQuote(opp.Id);
        opp.Customer_Business_Model__c = 'N/A';
        opp.Targeted_Platforms__c = 'Other';
        opp.Competitors__c = 'Other';
        opp.Importance_and_Priority__c = 'N/A';
        opp.StageName = '2 - Demo';
    }

    public static void setStage3(Opportunity opp) {
        opp.Addressable_Business_Problems__c = 'N/A';
        opp.Customer_Expected_Outcomes__c = 'N/A';
        opp.Integrations_Required__c = 'N/A';
        opp.Sales_Strategy_to_Win__c = 'N/A';
        opp.Value_Proposition__c = 'N/A';
        opp.Budget_Source__c = 'N/A';
        opp.StageName = '3 - Solution Design & Evaluation';
    }

    public static void setStage4(Opportunity opp) {
        opp.Customer_Buying_Steps__c = 'N/A';
        opp.Mutual_Action_Plan__c = 'N/A';
        opp.Proposal_Document__c = 'http://example.com';
        opp.Solution_Document__c = 'http://example.com';
        opp.Technical_Win__c = true;
        opp.Customer_Success_KPIs__c = 'N/A';
        opp.StageName = '4 - Negotiation';
    }

    public static Opportunity getStage1Opp(Id accountId, Id recordTypeId) {
        Contact contact = new Contact(
            LastName = 'getStage1Opp',
            Email = GuidUtility.generateGuid() + '@example.com',
            AccountId = accountId
        );
        insert contact;
        return getStubOpp(contact, recordTypeId);
    }

    public static Opportunity getStage2Opp(Id accountId, Id recordTypeId) {
        Opportunity opp = getStage1Opp(accountId, recordTypeId);
        insert opp;
        setStage2(opp);
        return opp;
    }

    public static Opportunity getStage3Opp(Id accountId, Id recordTypeId) {
        Opportunity opp = getStage2Opp(accountId, recordTypeId);
        setStage3(opp);
        return opp;
    }

    public static Opportunity getStage4Opp(Id accountId, Id recordTypeId) {
        Opportunity opp = getStage3Opp(accountId, recordTypeId);
        setStage4(opp);
        return opp;
    }

    public static Opportunity getStage1Opp(Id accountId) {
        return getStage1Opp(accountId, newBusinessRecordTypeId);
    }

    public static Opportunity getStage2Opp(Id accountId) {
        return getStage2Opp(accountId, newBusinessRecordTypeId);
    }

    public static Opportunity getStage3Opp(Id accountId) {
        return getStage3Opp(accountId, newBusinessRecordTypeId);
    }

    public static Opportunity getStage4Opp(Id accountId) {
        return getStage4Opp(accountId, newBusinessRecordTypeId);
    }

    public static void closeWin(Opportunity opp) {
        opp.StageName = 'Closed Won';
    }

    private static void createPrimaryQuote(Id opportunityId) {
        SBQQ__Quote__c quote = new SBQQ__Quote__c(
            SBQQ__Status__c = 'Draft',
            SBQQ__Opportunity2__c = opportunityId,
            SBQQ__Primary__c = true,
            SBQQ__StartDate__c = Date.today(),
            SBQQ__PricebookId__c = Test.getStandardPricebookId()
        );
        insert quote;
    }

    private static Opportunity getStubOpp(Contact contact, Id recordTypeId) {
        return new Opportunity(
            Name = 'OpportunityStageAccountHandlerTest',
            AccountId = contact.AccountId,
            ContactId = contact.Id,
            StageName = '1 - Discovery',
            CloseDate = System.today(),
            LeadSource = 'Other',
            RecordTypeId = recordTypeId,
            Solution_Document__c = 'http://www.google.com',
            Anticipated_Roadblocks_Challenges__c = 'OpportunityTestFactory',
            Invoice_Email_s__c = 'OpportunityTestFactory@OpportunityTestFactory.com'
        );
    }
}