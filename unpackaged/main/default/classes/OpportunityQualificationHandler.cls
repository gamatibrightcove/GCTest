public with sharing class OpportunityQualificationHandler extends DomainLogicHandler {
    private List<Opportunity> qualifiedOpps = new List<Opportunity>();
    private Id bdrRoleId;

    public override void check(Sobject newObj, SObject oldObj) {
        Opportunity newOpp = (Opportunity) newObj;
        if (isQualified(newOpp, oldObj)) {
            qualifiedOpps.add(newOpp);
        }
    }

    public override void processRecords() {
        if (!qualifiedOpps.isEmpty()) {
            setBrdRoleId();
            for (Opportunity newOpp : qualifiedOpps) {
                setQualiferFields(newOpp);
            }
        }
    }

    private Boolean isQualified(Opportunity newOpp, SObject oldOpp) {
        return TriggerUtility.isChanged(
                newOpp,
                oldOpp,
                Opportunity.StageName
            ) && newOpp.StageName == '0 - Meeting Occurred';
    }

    private void setBrdRoleId() {
        bdrRoleId = [SELECT Id FROM UserRole WHERE Name = 'BDR'].Id;
    }

    private void setQualiferFields(Opportunity newOpp) {
        newOpp.Qualifying_User__c = UserInfo.getUserId();
        newOpp.Qualifier_Role__c = UserInfo.getUserRoleId() == bdrRoleId
            ? 'BDR'
            : 'Sales Rep';
    }
}