trigger AccountTrigger on Account(before insert, before update, after update) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}