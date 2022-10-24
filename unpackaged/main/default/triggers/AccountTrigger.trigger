trigger AccountTrigger on Account(before insert, before update) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}
