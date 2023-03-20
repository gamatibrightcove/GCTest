trigger EmailMessageTrigger on EmailMessage(before insert) {
    EmailMessageRethreader.rethreadMessages(Trigger.new);
}