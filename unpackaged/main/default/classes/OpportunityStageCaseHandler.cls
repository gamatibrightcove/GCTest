public with sharing class OpportunityStageCaseHandler extends DomainLogicHandler {
    Map<Id, Id> opportunityAccountId = new Map<Id, Id>(); // OppId,AccountId

    public override void check(Sobject newObj, Sobject oldObj) {
        Opportunity newOpp = (Opportunity) newObj;
        Opportunity oldOpp = (Opportunity) oldObj;

        if (isQualified(newOpp, oldOpp)) {
            opportunityAccountId.put(newOpp.Id, newopp.AccountId);
        }
    }

    private Boolean isQualified(Opportunity newOpp, Opportunity oldOpp) {
        Id opportunityRecordType = RecordTypeUtility.getid(
            Opportunity.getSObjectType(),
            'New Business'
        );

        return (newOpp.StageName == 'Closed Won') &&
            (newOpp.StageName != oldOpp.StageName) &&
            (newOpp.RecordTypeId == opportunityRecordType);
    }

    public override void processRecords() {
        List<Case> caseSet = new List<Case>();

        Id technicalSupportRecordType = RecordTypeUtility.getid(
            Case.getSObjectType(),
            'Technical Support'
        );

        //Review SOQL if we have more Assignment rules add more WHERE
        AssignmentRule caseAssignRule = new AssignmentRule();
        caseAssignRule = [
            SELECT Id, name
            FROM AssignmentRule
            WHERE SObjectType = 'Case' AND Active = TRUE
        ];

        Database.DMLOptions dmlOpts = new Database.DMLOptions();
        dmlOpts.AssignmentRuleHeader.AssignmentRuleId = caseAssignRule.Id;

        List<Opportunity> opportunities = [
            SELECT
                Id,
                Name,
                AccountId,
                Account.Name,
                RecordType.Name,
                Owner.Name
            FROM Opportunity
            WHERE Id IN :opportunityAccountId.keySet()
        ];

        for (Opportunity oppRecord : opportunities) {
            Case techSupportCase = new Case();

            techSupportCase.setOptions(dmlOpts);
            techSupportCase.AccountId = oppRecord.AccountId;
            techSupportCase.RecordTypeId = technicalSupportRecordType;
            techSupportCase.Status = 'New';
            techSupportCase.Subject =
                '[Automated] Review: ' +
                oppRecord.Name +
                ' Account: ' +
                oppRecord.Account.Name;
            techSupportCase.First_Response__c = System.today();
            techSupportCase.Case_Language__c = 'English';
            techSupportCase.Description =
                'Account Name: ' +
                oppRecord.Account.Name +
                '\n' +
                'Account Link: ' +
                URL.getSalesforceBaseUrl().toExternalForm() +
                '/' +
                oppRecord.AccountId +
                '\n' +
                'Opportunity Owner: ' +
                oppRecord.Owner.Name +
                '\n' +
                'Opportunity Type: ' +
                oppRecord.recordType.Name +
                '\n' +
                'Opportunity Link: ' +
                URL.getSalesforceBaseUrl().toExternalForm() +
                '/' +
                oppRecord.Id +
                '\n \n' +
                'Thank you. \n Salesforce Team';
            techSupportCase.Type = 'Automated Task';
            techSupportCase.Priority = 'P3 - Normal';
            techSupportCase.Origin = 'System';

            caseSet.add(techSupportCase);
        }

        insert caseSet;
    }
}