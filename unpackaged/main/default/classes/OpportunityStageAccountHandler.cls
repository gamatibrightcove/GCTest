public with sharing class OpportunityStageAccountHandler extends DomainLogicHandler {
  List<Opportunity> oppsSet = new List<Opportunity>();
  List<Id> accountIds = new List<Id>();

  public override void check(Sobject newObj, Sobject oldObj) {
    Opportunity newOpp = (Opportunity) newObj;
    Opportunity oldOpp = (Opportunity) oldObj;

    if (isQualified(newOpp, oldOpp)) {
      oppsSet.add(newOpp);
      accountIds.add(newopp.AccountId);
    }
  }

  public override void processRecords() {
    Map<Id, Account> accounts = new Map<Id, Account>(
      [SELECT Id, Account_Stage__c FROM Account WHERE Id IN :accountIds]
    );

    Map<String, String> oppStageAccountStageMap = new Map<String, String>{
      'Closed Won' => 'Customer',
      'Closed Lost' => 'Former'
    };

    for (Opportunity opp : oppsSet) {
      Account record = accounts.get(opp.AccountId);

      switch on record.Account_Stage__c {
        when 'Prospect', 'Former' {
          if (opp.StageName == 'Closed Won') {
            record.Account_Stage__c = oppStageAccountStageMap.get(
              opp.StageName
            ); //It sets the Prospect or FORMER customer to --> CUSTOMER
          }
        }
        when 'Customer' {
          if (opp.StageName == 'Closed Lost') {
            record.Account_Stage__c = oppStageAccountStageMap.get(
              opp.StageName
            ); //It sets the CUSTOMER to CUSTOMER, or CUSTOMER to FORMER
          }
        }
      }
    }

    update accounts.values();
  }

  private Boolean isQualified(Opportunity newOpp, Opportunity oldOpp) {
    return isStageQualified(newOpp) && isStageChanged(newOpp, oldOpp);
  }

  private Boolean isStageChanged(Opportunity newOpp, Opportunity oldOpp) {
    return newOpp.StageName != oldOpp.StageName;
  }

  private Boolean isStageQualified(SObject oppty) {
    Opportunity opp = (Opportunity) oppty;
    List<String> qualifiedStages = new List<String>{
      'Closed Won',
      'Closed Lost'
    };

    return qualifiedStages.contains(opp.StageName);
  }
}