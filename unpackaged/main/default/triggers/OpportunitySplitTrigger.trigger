trigger OpportunitySplitTrigger on OpportunitySplit(before insert) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}