public with sharing class OpportunityClosedWonOrderedHandler extends DomainLogicHandler {
    List<SObjectField> qualifiedFields = new List<SObjectField>{
        Opportunity.StageName
    };

    public override void check(SObject newObj, SObject oldObj) {
        if (isQualified(newObj, oldObj)) {
            ((Opportunity) newObj).SBQQ__Ordered__c = true;
        }
    }

    private Boolean isQualified(SObject newObj, SObject oldObj) {
        return TriggerUtility.isChanged(newObj, oldObj, qualifiedFields) &&
            newObj.get('StageName') == 'Closed Won';
    }
}