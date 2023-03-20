public with sharing class Account6QAOppHandler extends DomainLogicHandler {
    private Map<Id, Account> qualifiedAccounts = new Map<Id, Account>();

    public override void check(SObject newObj, SObject oldObj) {
        Account newAccount = (Account) newObj;
        Account oldAccount = (Account) oldObj;

        if (isQualified(newAccount, oldAccount)) {
            qualifiedAccounts.put(newAccount.Id, newAccount);
        }
    }

    public override void processRecords() {
        Id oppLeadRecordType = RecordTypeUtility.getId(
            Opportunity.getSObjectType(),
            'Lead'
        );

        Map<Id, Account> accountTeams = new Map<Id, Account>(
            [
                SELECT
                    Id,
                    OwnerId,
                    (
                        SELECT Id, UserId
                        FROM AccountTeamMembers
                        WHERE TeamMemberRole = 'BDR'
                        LIMIT 1
                    )
                FROM Account
                WHERE Id IN :qualifiedAccounts.keySet()
            ]
        );

        List<Opportunity> opps = new List<Opportunity>();
        for (Account qualifiedAccount : qualifiedAccounts.values()) {
            opps.add(
                new Opportunity(
                    RecordTypeId = oppLeadRecordType,
                    CloseDate = Date.today().addDays(30),
                    AccountId = qualifiedAccount.Id,
                    StageName = '0 - Meeting Pending',
                    OwnerId = getOwnerId(accountTeams.get(qualifiedAccount.Id)),
                    Forecast__c = null,
                    LeadSource = 'QA'
                )
            );
        }

        insert opps;
    }

    private Id getOwnerId(Account account) {
        if (!account.AccountTeamMembers.isEmpty()) {
            return account.AccountTeamMembers[0].UserId;
        }
        return account.OwnerId;
    }

    private Boolean isQualified(Account newAccount, Account oldAccount) {
        return TriggerUtility.isChanged(
                newAccount,
                oldAccount,
                Account.X6QA__c
            ) && newAccount.X6QA__c;
    }
}