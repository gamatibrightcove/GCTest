public with sharing class EmailMessageRethreader {
    public static void rethreadMessages(List<EmailMessage> newMessages) {
        List<String> threadIds = new List<String>();
        Map<String, List<EmailMessage>> emailMessagesByGuid = new Map<String, List<EmailMessage>>();
        for (EmailMessage newMessage : newMessages) {
            String guid = Cases.getCaseIdFromEmailThreadId(
                newMessage.ThreadIdentifier
            );
            if (!emailMessagesByGuid.containsKey(guid)) {
                emailMessagesByGuid.put(guid, new List<EmailMessage>());
            }
            emailMessagesByGuid.get(guid).add(newMessage);
        }

        Map<String, Id> caseIdsByGuid = new Map<String, Id>();
        List<Case> guidCases = [
            SELECT Id, GUID__c
            FROM Case
            WHERE GUID__c IN :emailMessagesByGuid.keySet()
        ];
        for (Case guidCase : guidCases) {
            caseIdsByGuid.put(guidCase.Guid__c, guidCase.Id);
        }

        for (String guid : emailMessagesByGuid.keySet()) {
            if (caseIdsByGuid.containsKey(guid)) {
                String newThreadId = Cases.generateThreadingMessageId(
                    caseIdsByGuid.get(guid)
                );
                for (EmailMessage newMessage : emailMessagesByGuid.get(guid)) {
                    newMessage.ThreadIdentifier = newThreadId;
                }
            }
        }
    }
}