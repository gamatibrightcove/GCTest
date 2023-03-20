public with sharing class SubscriptionSupportPackageUpdate extends DomainLogicHandler {
  List<Id> subscriptionIds = new List<Id>();

  public override void check(SObject newObject) {
    SBQQ__Subscription__c subscription = (SBQQ__Subscription__c) newObject;

    switch on subscription.SBQQ__ProductName__c {
      when 'Silver Support',
        'Gold Support',
        'Platinum Support',
        'Platinum Plus Support' {
        subscriptionIds.add(subscription.Id);
      }
    }
  }

  @future
  private static void processSupportPackage(List<Id> subscriptionIds) {
    Map<String, Id> slaProcessesSet = new Map<String, Id>();

    for (SlaProcess slaProcessRec : [
      SELECT Id, Name, IsVersionDefault
      FROM SlaProcess
      WHERE IsVersionDefault = TRUE
    ]) {
      slaProcessesSet.put(slaProcessRec.Name, slaProcessRec.Id);
    }

    List<SBQQ__Subscription__c> subscriptions = [
      SELECT
        Id,
        SBQQ__Account__c,
        SBQQ__ProductName__c,
        SBQQ__Quantity__c,
        SBQQ__StartDate__c,
        SBQQ__EndDate__c
      FROM SBQQ__Subscription__c
      WHERE Id IN :subscriptionIds
    ];

    Map<Id, SBQQ__Subscription__c> accountWSubscriptions = new Map<Id, SBQQ__Subscription__c>();

    for (SBQQ__Subscription__c subscriptionRecord : subscriptions) {
      accountWSubscriptions.put(
        subscriptionRecord.SBQQ__Account__c,
        subscriptionRecord
      );
    }

    List<Account> accountSet = [
      SELECT Id, Total_Live_Event_Support_hours_sold__c, Sales_Division__c, Live_Event_Support_hours_available__c
      FROM Account
      WHERE Id IN :accountWSubscriptions.keySet()
    ];

    List<Entitlement> entitlements = new List<Entitlement>();

    for (Account accountRecord : accountSet) {
      Entitlement supportPackageEntitlement = new Entitlement();
      accountRecord.Total_Live_Event_Support_hours_sold__c = 0;

      String newSupportPackage = accountWSubscriptions.get(accountRecord.Id)
        .SBQQ__ProductName__c;

      switch on newSupportPackage {
        when 'Silver Support' {
          accountRecord.Support_package__c = 'Silver';
          supportPackageEntitlement.SlaProcessId = slaProcessesSet.get(
            'Silver ' + accountRecord.Sales_Division__c
          );
          accountRecord.Total_Live_Event_Support_hours_sold__c += 0;
          accountRecord.Live_Event_Support_hours_available__c += 0;
        }
        when 'Gold Support' {
          accountRecord.Support_package__c = 'Gold';
          accountRecord.Total_Live_Event_Support_hours_sold__c += 4;
          accountRecord.Live_Event_Support_hours_available__c += 4;
          supportPackageEntitlement.SlaProcessId = slaProcessesSet.get('Gold');
        }
        when 'Platinum Plus Support' {
          accountRecord.Support_package__c = 'Platinum+';
          accountRecord.Total_Live_Event_Support_hours_sold__c += 12;
          accountRecord.Live_Event_Support_hours_available__c += 12;
          supportPackageEntitlement.SlaProcessId = slaProcessesSet.get(
            'Platinum'
          );
          accountRecord.Platinum_Alerts_Active__c = true;
        }
        when 'Platinum Support' {
          accountRecord.Support_package__c = 'Platinum';
          accountRecord.Total_Live_Event_Support_hours_sold__c += 12;
          accountRecord.Live_Event_Support_hours_available__c += 12;
          supportPackageEntitlement.SlaProcessId = slaProcessesSet.get(
            'Platinum'
          );
          accountRecord.Platinum_Alerts_Active__c = true;
        }
      }

      supportPackageEntitlement.AccountId = accountRecord.Id;

      supportPackageEntitlement.Name = accountWSubscriptions.get(
          accountRecord.Id
        )
        .SBQQ__ProductName__c;

      supportPackageEntitlement.StartDate = accountWSubscriptions.get(
          accountRecord.Id
        )
        .SBQQ__StartDate__c;
      supportPackageEntitlement.EndDate = accountWSubscriptions.get(
          accountRecord.Id
        )
        .SBQQ__EndDate__c;

      entitlements.add(supportPackageEntitlement);
    }

    insert entitlements;
    update accountSet;
  }

  public override void processRecords() {
    processSupportPackage(subscriptionIds);
  }
}