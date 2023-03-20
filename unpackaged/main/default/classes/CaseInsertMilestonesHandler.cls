public with sharing class CaseInsertMilestonesHandler extends DomainLogicHandler {
  List<Case> caseSet = new List<Case>();
  Map<Id, Id> contactAccountIds = new Map<Id, Id>();

  List<Id> contactIds = new List<Id>();
  List<Id> accountIds = new List<Id>();

  public override void check(SObject newObject) {
    Case newCase = (Case) newObject;

    if (isQualified(newCase)) {
      caseSet.add(newCase);
      contactIds.add(newCase.ContactId);
      accountIds.add(newCase.AccountId);
    }
  }
  private Boolean isQualified(Case newCase) {
    Id technicalSupportRecordType = RecordTypeUtility.getid(
      Case.getSObjectType(),
      'Technical Support'
    );
    return newCase.EntitlementId == null &&
      newCase.RecordTypeId == technicalSupportRecordType;
  }

  public override void processRecords() {
    insertCaseMilestones();
  }

  private void insertCaseMilestones() {
    List<Contact> contactFromAccounts = [
      SELECT Id, AccountId
      FROM Contact
      WHERE Id IN :contactIds
    ];

    for (Contact contactCase : contactFromAccounts) {
      contactAccountIds.put(contactCase.Id, contactCase.AccountId);
    }

    accountIds.addAll(contactAccountIds.values());

    List<Entitlement> entitlements;
    entitlements = [
      SELECT Id, AccountId
      FROM Entitlement
      WHERE AccountId IN :accountIds AND Status = 'Active'
    ];

    Map<Id, Id> accountEntitlementsIds = new Map<Id, Id>();

    for (Entitlement entitl : entitlements) {
      accountEntitlementsIds.put(entitl.AccountId, entitl.id);
    }

    for (Case caseRec : caseSet) {
      Id accountId = caseRec.AccountId;

      if (accountId == null) {
        accountId = contactAccountIds.get(caseRec.ContactId);
      }

      if (accountEntitlementsIds.containsKey(accountId)) {
        caseRec.EntitlementId = accountEntitlementsIds.get(accountId);
      }
    }
  }
}