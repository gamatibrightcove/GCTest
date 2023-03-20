trigger ContactTrigger on Contact(before insert, after insert, before update) {
    DomainHandlerUtility handler = new DomainHandlerUtility();
    handler.process();
}