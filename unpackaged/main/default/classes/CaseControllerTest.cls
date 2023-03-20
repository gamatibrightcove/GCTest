@IsTest
public with sharing class CaseControllerTest {

    /*
    * @MethodName InsertMethod()
    * @author Sowdhanya Karri
    * @date June 2016 
    * @description InsertMethod() method is written to setup testdata for Account,Contact,Videos,Video Items,and Video Activity to test the insertion of record into Video activities.
    */

    static testMethod void testGetCaseDetails() 
    {
        Case newCase = new Case();
        insert newCase;
        CaseController.getCaseDetails(newCase.Id);
        newCase = [SELECT Request_closure__c, Priority, E2CP__AdditionalCC__c 
            FROM Case where ID = :newCase.Id];
        System.assertEquals(true, newCase.Priority != null,
            'Priority is: ' + newCase.Priority);
        System.assertEquals(true, newCase.Request_closure__c != null,
            'Request_closure__c is: ' + newCase.Request_closure__c);
        CaseController.componentAvailable(UserInfo.getUserId());
    }
    static testMethod void testRequestClosure() 
    {
        Case newCase = new Case();
        insert newCase;
        newCase = [SELECT Request_closure__c FROM Case where ID = :newCase.Id];
        System.assertEquals(false, newCase.Request_closure__c, 
            'newCase.Request_closure__c is: ' + newCase.Request_closure__c);
        CaseController.requestClosure(newCase.Id);
        newCase = [SELECT Request_closure__c FROM Case where ID = :newCase.Id];
        System.assertEquals(true, newCase.Request_closure__c, 
            'newCase.Request_closure__c is: ' + newCase.Request_closure__c);
    }

    static testMethod void testUpdatePriority() 
    {
        Case newCase = new Case(Priority = 'P3');
        insert newCase;
        newCase = [SELECT Priority FROM Case where ID = :newCase.Id];
        System.assertEquals(true, newCase.Priority == 'P3', 
            'newCase.Priority is: ' + newCase.Priority);
        CaseController.updatePriority(newCase.Id, 'P2');
        newCase = [SELECT Priority FROM Case where ID = :newCase.Id];
        System.assertEquals(true, newCase.Priority == 'P2', 
            'newCase.Priority is: ' + newCase.Priority);
        String userId = UserInfo.getUserId();
    }
}