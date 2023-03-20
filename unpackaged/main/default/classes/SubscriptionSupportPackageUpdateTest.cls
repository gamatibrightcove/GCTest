@isTest
public with sharing class SubscriptionSupportPackageUpdateTest {
  @TestSetup
  static void createDataSet() {
    Id accountRecordType = RecordTypeUtility.getid(
      Account.getSObjectType(),
      'Customer'
    );

    List<Account> accounts = new List<Account>();
    for (Integer i = 0; i <= 3; i++) {
      Account account = new Account();
      account.Name = 'TESTSUBSCRiPTIONS' + i;
      account.RecordTypeId = accountRecordType;
      account.Total_Live_Event_Support_hours_sold__c = 0;
      account.Support_package__c = '';
      account.Account_Stage__c = 'Customer';
      account.Sales_Division__c = 'EMEA';

      accounts.add(account);
    }
    insert accounts;
    List<Contract> contractlist = new List<Contract>();

    for (Account accountRec : accounts) {
      Contract contractRec = new Contract();
      contractRec.AccountId = accountRec.Id;
      contractRec.StartDate = system.today();
      contractRec.ContractTerm = 12;

      contractlist.add(contractRec);
    }
    insert contractlist;

    List<String> supportName = new List<String>{
      'Silver Support',
      'Gold Support',
      'Platinum Support',
      'Platinum Plus Support'
    };

    List<Product2> prodList = new List<Product2>();
    for (String s : supportName) {
      Product2 supportProd = new Product2();
      supportProd.Name = s;
      supportProd.Family = 'Support';
      prodList.add(supportProd);
    }

    insert prodList;
  }

  @isTest
  static void createSubscriptions() {
    List<Account> accounts = [
      SELECT Id, Sales_Division__c
      FROM Account
      WHERE Name LIKE 'TESTSUBSCRiPTIONS%'
    ];

    List<Contract> contracts = [
      SELECT Id, StartDate, EndDate, AccountId
      FROM Contract
      WHERE AccountId IN :accounts
    ];

    List<Product2> productList = [
      SELECT Id, Name
      FROM Product2
      WHERE Family = 'Support'
    ];

    Test.startTest();
    List<SBQQ__Subscription__c> subscriptions = new List<SBQQ__Subscription__c>();
    Integer i = 0;
    for (Account accountRec : accounts) {
      SBQQ__Subscription__c subscription = new SBQQ__Subscription__c();
      subscription.SBQQ__Account__c = accountRec.Id;
      subscription.SBQQ__Contract__c = contracts[i].Id;
      subscription.SBQQ__Quantity__c = 1;
      subscription.SBQQ__Product__c = productList[i].Id;
      i++;
      subscriptions.add(subscription);
    }
    insert subscriptions;
    Test.stopTest();
    system.debug('Subscriptions ' + subscriptions);

    List<Account> accountsAfter = [
      SELECT Id, Support_package__c, Total_Live_Event_Support_hours_sold__c
      FROM Account
      WHERE Name LIKE 'TESTSUBSCRiPTIONS%'
    ];
    System.debug('Account ' + accounts);

    List<Entitlement> entitlments = [
      SELECT Id, Name
      FROM Entitlement
      WHERE AccountId IN :accountsAfter
    ];
    System.debug('Entitlement ' + entitlments);

    i = 0;
    for (Account acc : accountsAfter) {
      switch on acc.Support_package__c {
        when 'Gold', 'Platinum', 'Platinum+' {
          system.assert(
            Acc.Total_Live_Event_Support_hours_sold__c > 0,
            'Default Live hours NOT assigned correctly for Gold, Platinum, Platinum+'
          );
        }
        when else {
          system.assertEquals(
            Acc.Total_Live_Event_Support_hours_sold__c,
            0,
            'Default Live hours NOT assigned correctly for Silver'
          );
        }
      }

      System.assert(
        Acc.Support_package__c != '',
        'Account Support Package not initialised correctly'
      );

      i++;
    }
  }
}