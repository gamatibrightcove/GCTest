trigger BrightcoveAccountTrigger on Brightcove_Account__c(before insert) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}