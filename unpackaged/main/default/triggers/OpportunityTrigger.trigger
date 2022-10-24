trigger OpportunityTrigger on Opportunity(before insert, after insert, after update) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();

}
