trigger LiveEventCoverageTrigger on Live_Event_Coverage__c(
    before insert,
    before update
) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}