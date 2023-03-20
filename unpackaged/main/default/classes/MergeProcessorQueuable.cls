public with sharing class MergeProcessorQueuable implements Queueable {
    Boolean needsRequeue = false;

    public void execute(QueueableContext ctx) {
        String dunsNumber = getDunsNumber();

        if (dunsNumber == null) {
            return;
        }

        List<Account> accounts = [
            SELECT Id, Account_Stage__c
            FROM Account
            WHERE D_U_N_S_Number__c = :dunsNumber
            ORDER BY Account_Stage__c DESC
        ];

        needsRequeue = accounts.size() > 3;

        Account primaryAccount = accounts[0];
        List<Account> secondaryAccounts = new List<Account>{ accounts[1] };
        if (accounts.size() > 2) {
            secondaryAccounts.add(accounts[2]);
        }

        processMerge(primaryAccount, secondaryAccounts);
        if (needsRequeue) {
            System.enqueueJob(new MergeProcessorQueuable());
        }
    }

    private String getDunsNumber() {
        List<AggregateResult> aggregateResults = [
            SELECT D_U_N_S_Number__c
            FROM Account
            GROUP BY D_U_N_S_Number__c
            HAVING COUNT(Id) > 2
        ];

        if (aggregateResults.isEmpty()) {
            return null;
        }

        needsRequeue = aggregateResults.size() > 1;

        return (String) aggregateResults[0].get('D_U_N_S_Number__c');
    }

    public void processMerge(SObject primary, List<SObject> secondaries) {
        try {
            List<Database.MergeResult> results = Database.merge(
                primary,
                secondaries,
                false
            );
            for (Database.MergeResult result : results) {
                if (!result.isSuccess()) {
                    List<Database.Error> errors = result.getErrors();
                    List<String> errorMessages = new List<String>();
                    for (Database.Error error : errors) {
                        errorMessages.add(error.getMessage());
                    }
                    throw new MergeException(
                        'Errors = ' + String.join(errorMessages, ',\n')
                    );
                }
            }
        } catch (Exception e) {
            System.debug('Exception = ' + e.getMessage());
        }
    }

    class MergeException extends Exception {
    }
}