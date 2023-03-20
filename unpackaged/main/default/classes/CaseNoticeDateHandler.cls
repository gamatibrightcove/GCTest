public with sharing class CaseNoticeDateHandler extends DomainLogicHandler {
    public override void check(SObject newObj, SObject oldObj) {
        Case newCase = (Case) newObj;
        Case oldCase = (Case) oldObj;
        if (isQualified(newCase, oldCase)) {
            newCase.Notice_1_Date__c = null;
            newCase.Notice_2_Date__c = null;
        }
    }

    private Boolean isQualified(Case newCase, Case oldCase) {
        return newCase.Status != oldCase.Status && isStatusQualified(newCase);
    }

    private Boolean isStatusQualified(Case newCase) {
        List<String> disqualifiedStatuses = new List<String>{
            'Pending - Customer - Info Provided',
            'Pending - Customer - Need More Info - 8',
            'Pending - Customer - Info Provided - 8',
            'Closed',
            'Closed - First Response',
            'Closed - No Response',
            'Closed - Unresolved'
        };

        return disqualifiedStatuses.contains(newCase.Status);
    }
}