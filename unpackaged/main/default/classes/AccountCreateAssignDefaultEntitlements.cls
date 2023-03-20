public with sharing class AccountCreateAssignDefaultEntitlements extends DomainLogicHandler {
  List<Account> accountSet = new List<Account>();

  public override void check(SObject newObject) {
    Id accountRecordType = RecordTypeUtility.getid(
      Account.getSObjectType(),
      'Customer'
    );

    Account accountRecord = (Account) newObject;
    if (
      (accountRecord.RecordTypeId == accountRecordType) &&
      (accountRecord.Account_Stage__c == 'Prospect')
    ) {
      accountSet.add(accountRecord);
    }
  }

  public override void check(SObject newObj, SObject oldObj) {
    Account newAccount = (Account) newObj;
    Account oldAccount = (Account) oldObj;

    Id accountRecordType = RecordTypeUtility.getid(
      Account.getSObjectType(),
      'Customer'
    );

    if (
      (newAccount.RecordTypeId == accountRecordType) &&
      (newAccount.Account_Stage__c != oldAccount.Account_Stage__c) &&
      (newAccount.Account_Stage__c == 'Former')
    ) {
      accountSet.add(newAccount);
    }
  }

  public override void processRecords() {
    List<Entitlement> entitlementSet = new List<Entitlement>();
    List<Entitlement> entlToDeactivate = new List<Entitlement>();

    if (accountSet.size() > 0) {
      entlToDeactivate = [
        SELECT id, AccountId
        FROM Entitlement
        WHERE AccountId IN :accountSet
      ];
      System.debug('AccountSET: ' + accountSet);
      System.debug('EntToDeactivate: ' + entlToDeactivate);

      for (Entitlement entl : entlToDeactivate) {
        entl.EndDate = System.today().addDays(-1);
      }

      update entlToDeactivate;

      SlaProcess goldSlaProcessId = [
        SELECT Id
        FROM SlaProcess
        WHERE Name = 'Gold'
      ];
      for (Account accRecord : accountSet) {
        Entitlement supportPackageEntitlement = new Entitlement();

        accRecord.Support_package__c = 'Gold';

        supportPackageEntitlement.AccountId = accRecord.Id;
        supportPackageEntitlement.SlaProcessId = goldSlaProcessId.Id;
        supportPackageEntitlement.StartDate = System.today();
        supportPackageEntitlement.Name = 'Default - Gold Support';
        entitlementSet.add(supportPackageEntitlement);
      }

      insert entitlementSet;
      update accountSet;
    }
  }
}