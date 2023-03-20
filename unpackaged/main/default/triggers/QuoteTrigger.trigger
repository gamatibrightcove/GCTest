trigger QuoteTrigger on SBQQ__Quote__c(before insert, before update) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}