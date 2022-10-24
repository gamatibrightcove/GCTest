public with sharing class AccountHierarchyCheckHandler extends DomainLogicHandler {
    List<Account> workSet = new List<Account>();
    Id customerRecordTypeId = getRecordTypeIdByName('Customer');

    public override void check(SObject newObj) {
        Account account = (Account) newObj;
        if (account.RecordTypeId == customerRecordTypeId) {
            workSet.add(account);
        }
    }

    public override void check(SObject newObj, SObject oldObj) {
        Account account = (Account) newObj;
        Account oldAccount = (Account) oldObj;

        if (
            account.RecordTypeId == customerRecordTypeId &&
            account.ParentId != null &&
            account.ParentId != oldAccount.ParentId
        ) {
            workSet.add(account);
        }
    }

    public override void processRecords() {
        for (Account acc : workSet) {
            acc.Pending_Hierarchy_Review__c = true;
        }
    }

    private String getRecordTypeIdByName(String recordTypeName) {
        return Account.SObjectType.getDescribe(SObjectDescribeOptions.DEFERRED)
            .getRecordTypeInfosByName()
            .get(recordTypeName)
            .getRecordTypeId();
    }
}
