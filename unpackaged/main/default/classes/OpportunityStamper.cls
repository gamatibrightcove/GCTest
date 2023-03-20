public with sharing class OpportunityStamper extends DomainLogicHandler {
    private FieldStamperUtility stamper = new FieldStamperUtility(
        new Map<SObjectField, FieldStamper>{
            Opportunity.StageName => new OpportunityStageDateStamper()
        }
    );

    public override void check(SObject newObj) {
        stamper.qualifyRecord(newObj);
    }

    public override void check(SObject newObj, SObject oldObj) {
        stamper.qualifyRecord(newObj, oldObj);
    }

    public override void processRecords() {
        stamper.processStampers();
    }
}