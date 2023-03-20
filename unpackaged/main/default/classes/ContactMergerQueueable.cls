public with sharing class ContactMergerQueueable implements Queueable {
    private Boolean needsRequeue = false;
    public void execute(QueueableContext ctx) {
        String email = getEmail();

        if (email == null) {
            return;
        }

        Map<Id, Contact> contacts = new Map<Id, Contact>(
            [SELECT Id FROM Contact WHERE Email = :email LIMIT 3]
        );

        Id portalContactId = getPortalContactId(email);

        Contact primary = portalContactId == null
            ? contacts.values()[0]
            : contacts.get(portalContactId);
        List<Contact> secondaries = new List<Contact>();
        for (Contact contact : contacts.values()) {
            if (contact != primary) {
                secondaries.add(contact);
            }
        }

        Boolean isSuccess = MergeProcessor.processMerge(primary, secondaries);
        if (isSuccess && needsRequeue) {
            System.enqueueJob(new ContactMergerQueueable());
        }
    }

    private Id getPortalContactId(String email) {
        List<User> portalUsers = [
            SELECT Id, ContactId
            FROM User
            WHERE Email = :email
        ];

        if (!portalUsers.isEmpty()) {
            return portalUsers[0].ContactId;
        }

        return null;
    }

    private String getEmail() {
        List<AggregateResult> aggregateResults = [
            SELECT Email
            FROM Contact
            GROUP BY Email
            HAVING COUNT(Id) > 2
        ];

        if (aggregateResults.isEmpty()) {
            return null;
        }

        needsRequeue = aggregateResults.size() > 1;

        return (String) aggregateResults[0].get('Email');
    }
}