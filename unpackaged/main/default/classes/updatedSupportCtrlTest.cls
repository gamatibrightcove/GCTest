@IsTest
public class updatedSupportCtrlTest {
    
    static testMethod void testGetCaseDetails() {
        Case newCase = new Case(Subject ='test');
        insert newCase;
        Account a = new account (Name='EvilCorp');
        insert a;
        Contact co = new contact(AccountId=a.Id, LastName='tester', email= 'test@testiong.com');
        insert co;
        newCase.ContactId = co.Id;
        update newCase;

        updatedSupportCtrl.getSearchCases('test');

    }
    
}