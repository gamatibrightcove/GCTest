public class BatchContractRenewalQuote implements Database.Batchable<sObject> {
    public final String query;
    public final List<String> fields = new List<String>{
        'Id',
        'SBQQ__RenewalQuoted__c'
    };

    public BatchContractRenewalQuote() {
        String dateString = String.valueOf(Date.today() + 90);
        query = String.format(
            'SELECT {0} FROM Contract WHERE EndDate <= {1} AND SBQQ__RenewalQuoted__c = false',
            new List<String>{ String.join(fields, ', '), dateString }
        );
    }

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext bc, List<sObject> scope) {
        List<Contract> contracts = (List<Contract>) scope;
        for (Contract c : contracts) {
            c.SBQQ__RenewalQuoted__c = true;
        }

        update contracts;
    }

    public void finish(Database.BatchableContext bc) {
        return;
    }
}