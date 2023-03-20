@isTest
public with sharing class CaseInsertMilestonesHandlerTest {
  @TestSetup
  static void createDataSet() {
    Id accountRecordType = RecordTypeUtility.getid(
      Account.getSObjectType(),
      'Customer'
    );

    List<SlaProcess> slaProcessesId = [
    SELECT Id, description, Name
      FROM SlaProcess
      WHERE
        SObjectType = 'Case'
        AND IsActive = TRUE
        AND IsVersionDefault = TRUE
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
      Contact cont = new Contact();
      String email = 'test' + acc.Name;
      cont.FirstName = 'test';
      cont.LastName = 'test';
      cont.AccountId = acc.Id;
      cont.Email = email + '@gmail.com';
      contactsAccount.add(cont);
    }

    insert contactsAccount;

    List<Entitlement> accountEntitlments = new List<Entitlement>();
    for (Account acc : accounts) {
      Entitlement accountEntitlment = new Entitlement();
      accountEntitlment.AccountId = acc.Id;

      accountEntitlment.SlaProcessId = slaProcessesId[0].Id;
      accountEntitlment.Name = 'TestSLA ' + acc.Name;
      accountEntitlment.StartDate = System.today();
      accountEntitlment.EndDate = Date.newInstance(2041, 4, 12);

      accountEntitlments.add(accountEntitlment);
    }

    insert accountEntitlments;
  }

  @isTest
  static void testMilestonesOnCases() {
    List<Case> cases = new List<Case>();

    List<Contact> contactList = [
      SELECT Id, AccountId
      FROM Contact
      WHERE Account.name LIKE 'TESTSLA%'
    ];

    List<Account> accountList = [
      SELECT Id
      FROM Account
      WHERE Name LIKE 'TESTSLA%'
    ];

    Id technicalSupportRecordType = RecordTypeUtility.getid(
      Case.getSObjectType(),
      'Technical Support'
    );

    Test.startTest();
    for (Contact contactTest : contactList) {
      Case caseAccount = new Case();

      caseAccount.ContactId = contactTest.Id;
      caseAccount.Status = 'New';
      caseAccount.RecordTypeId = technicalSupportRecordType;
      caseAccount.Origin = 'Email';
      caseAccount.Priority = 'P1 - Critical';
      caseAccount.Subject = 'TEST MILESTONE';
      caseAccount.Description = 'TEST TEST';
      cases.add(caseAccount);
    }

    for (Account accRec : accountList) {
      Case accountCase = new Case();
      accountCase.Status = 'New';
      accountCase.RecordTypeId = technicalSupportRecordType;
      accountCase.Origin = 'Email';
      accountCase.Priority = 'P1 - Critical';
      accountCase.AccountId = accRec.Id;
      cases.add(accountCase);
    }
    insert cases;

    Test.stopTest();

    cases = [
      SELECT Id
      FROM Case
      WHERE Status = 'New' AND Subject = 'TEST MILESTONE'
    ];

    List<CaseMilestone> caseMilestones = [
      SELECT Id, MilestoneTypeId, CaseId, MilestoneType.Name
      FROM CaseMilestone
      WHERE CaseId IN :cases
    ];

    System.assertEquals(
      false,
      caseMilestones.isEmpty(),
      'Not all the cases have a milestone added'
    );

    for (CaseMilestone casemilestone : caseMilestones) {
      System.assertEquals(
        'First Response',
        casemilestone.MilestoneType.Name,
        'Not all the cases have a First Response Case milestone'
      );
    }
  }
}