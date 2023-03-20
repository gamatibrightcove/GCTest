@isTest
public with sharing class CaseUpdateMilestoneCompleteHandlerTest {
  @TestSetup
  static void createDataSet() {
    Id accountRecordType = RecordTypeUtility.getid(
      Account.getSObjectType(),
      'Customer'
    );

    SlaProcess slaProcessesId = [
      SELECT Id, Description, Name
      FROM SlaProcess
      WHERE
        SObjectType = 'Case'
        AND IsActive = true
        AND IsVersionDefault = true
        AND Name = 'Platinum'
    ];

    List<Account> accounts = new List<Account>();
    for (Integer i = 0; i < 3; i++) {
      Account account = new Account();
      account.Name = 'TESTSLA' + i;
      account.RecordTypeId = accountRecordType;
      account.Account_Stage__c = 'Prospect';

      accounts.add(account);
    }

    insert accounts;

    List<Contact> contactsAccount = new List<Contact>();
    for (Account acc : accounts) {
      Contact contact = new Contact();
      String email = 'test' + acc.Name;
      contact.FirstName = 'test';
      contact.LastName = 'test';
      contact.AccountId = acc.Id;
      contact.Email = email + '@gmail.com';
      contactsAccount.add(contact);
    }

    insert contactsAccount;

    List<Entitlement> accountEntitlments = new List<Entitlement>();
    for (Account account : accounts) {
      Entitlement accountEntitlement = new Entitlement();
      accountEntitlement.AccountId = account.Id;

      accountEntitlement.SlaProcessId = slaProcessesId.Id;
      accountEntitlement.Name = 'TestSLA ' + account.Name;
      accountEntitlement.StartDate = System.today();
      accountEntitlement.EndDate = System.today().addDays(20);

      accountEntitlments.add(accountEntitlement);
    }

    insert accountEntitlments;

    Id technicalSupportRecordType = RecordTypeUtility.getid(
      Case.getSObjectType(),
      'Technical Support'
    );

    List<Case> caseList = new List<Case>();
    for (Contact contact : contactsAccount) {
      Case cases = new Case();
      cases.ContactId = contact.Id;
      cases.RecordTypeId = technicalSupportRecordType;
      cases.Priority = 'P1 - Critical';
      cases.Subject = 'TEST SLA';
      cases.Origin = 'Email';

      caseList.add(cases);
    }
    insert caseList;
  }

  @isTest
  static void testMilestonesOnCases() {
    List<Case> caseList = [
      SELECT Id, Subject, ContactId
      FROM CASE
      WHERE Subject = 'TEST SLA'
    ];

    Test.startTest();
    for (Case cases : caseList) {
      cases.First_Response__c = System.now();
    }
    update caseList;
    Test.stopTest();

    List<CaseMilestone> caseMilestones = [
      SELECT Id, MilestoneTypeId, CaseId, IsCompleted
      FROM CaseMilestone
      WHERE CaseId IN :caseList
    ];

    for (CaseMilestone cm : caseMilestones) {
      System.assertEquals(
        true,
        cm.IsCompleted,
        'Not all milestones have bene completed'
      );
    }
  }
}