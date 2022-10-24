public with sharing class OpportunityNameHandler extends DomainLogicHandler {
    List<Opportunity> workSet = new List<Opportunity>();
    Map<Id, String> recordTypeNameByIdMap = new Map<Id, String>();
    Map<Id, Account> accountsByIdMap = new Map<Id, Account>();

    public override void check(Sobject newObj) {
        workSet.add((Opportunity) newObj);
    }

    public override void processRecords() {
        setRecordTypeNameMap();
        setAccountMap();

        for (Opportunity opp : workSet) {
            opp.Name = getOpportunityName(opp);
        }
    }

    private String getOpportunityName(Opportunity opp) {
        String accountName = accountsByIdMap.get(opp.AccountId).Name;
        String recordTypeName = recordTypeNameByIdMap.get(opp.RecordTypeId);
        String createdDate =
            String.valueOf(Date.today().month()) +
            '/' +
            String.valueOf(Date.today().year());

        if (accountName.length() > 80) {
            accountName = accountName.left(80).trim();
        }

        List<String> nameArguments = new List<String>{
            accountName,
            recordTypeName,
            createdDate
        };

        return String.format(
            '{0} - {1} - {2}',
            nameArguments
        );
    }

    private void setRecordTypeNameMap() {
        List<Schema.RecordTypeInfo> recordTypeInfos = Opportunity.SObjectType.getDescribe().getRecordTypeInfos();

        for(Schema.RecordTypeInfo rti : recordTypeInfos) {
            recordTypeNameByIdMap.put(rti.getRecordTypeId(), rti.getName());
        }
    }

    private void setAccountMap() {
        Set<Id> accountIds = new Set<Id>();
        for (Opportunity opp : workSet) {
            accountIds.add(opp.AccountId);
        }

        accountsByIdMap = new Map<Id, Account>(
            [SELECT Id, Name FROM Account WHERE Id IN :accountIds]
        );
    }
}
