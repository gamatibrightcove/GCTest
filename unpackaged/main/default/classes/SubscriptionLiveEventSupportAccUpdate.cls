public with sharing class SubscriptionLiveEventSupportAccUpdate extends DomainLogicHandler {
  Map<Id, Decimal> accountWsub = new Map<Id, Decimal>();

  public override void check(SObject newObject) {
    SBQQ__Subscription__c subscription = (SBQQ__Subscription__c) newObject;

    if (
      (subscription.SBQQ__ProductName__c ==
      'Live Streaming Special Event Support')
    ) {
      accountWsub.put(
        subscription.SBQQ__Account__c,
        subscription.SBQQ__Quantity__c
      );
    }
  }

  @future
  private static void processAccounts(Map<Id, Decimal> accountLiveHours) {
    List<Account> accountSet = [
      SELECT
        Id,
        Total_Live_Event_Support_hours_sold__c,
        Live_Event_Support_hours_available__c
      FROM Account
      WHERE Id IN :accountLiveHours.keyset()
    ];

    for (Account accountRecord : accountSet) {
      accountRecord.Total_Live_Event_Support_hours_sold__c += accountLiveHours.get(
        accountRecord.Id
      );
      accountRecord.Live_Event_Support_hours_available__c += accountLiveHours.get(
        accountRecord.Id
      );
    }

    update accountSet;
  }

  public override void processRecords() {
    processAccounts(accountWsub);
  }
}