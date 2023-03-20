public with sharing class AccountCreatedDateMergeQueueable implements Queueable {
    public void execute(QueueableContext ctx) {
        String guid = getGuid();
        if (guid == null) {
            return;
        }

        List<Account> accounts = Database.query(
            MergeProcessor.getSelectStarQuery(Account.getSObjectType()) +
            ' WHERE GUID__c = :guid ORDER BY Id DESC'
        );

        Account primary = accounts[0];
        Account secondary = accounts[1];
        copySecondariesValues(primary, secondary);
        try {
        	MergeProcessor.processMerge(primary, new List<Account>{ secondary });    
            if (!Test.isRunningTest()) {
                //System.enqueueJob(new AccountCreatedDateMergeQueueable());
            }
        } catch(Exception e) {
            System.debug('Message = ' + e.getMessage());
            System.debug('Stack = ' + e.getStackTraceString());
        }
    }

    void copySecondariesValues(Account primary, Account secondary) {
        List<String> fields = MergeProcessor.getQueryFields(
            Account.getSObjectType()
        );
        for (String field : fields) {
            if (primary.get(field) == null) {
                if (secondary.get(field) != null) {
                    primary.put(field, secondary.get(field));
                    break;
                }
            }
        }
    }

    String getGuid() {
        List<AggregateResult> results = [
            SELECT GUID__c
            FROM Account
            GROUP BY GUID__c
            HAVING COUNT(Id) > 1
            LIMIT 1
        ];

        if (results.isEmpty()) {
            return null;
        }

        return (String) results[0].get('GUID__c');
    }
}