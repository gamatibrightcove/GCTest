@isTest
public with sharing class LeadStamperTest {
    @isTest
    private static void testStamp() {
        List<PicklistEntry> stages = Lead.Stage__c.getDescribe()
            .getPicklistValues();
        Lead testLead = new Lead(
            LastName = 'LeadStamperTest',
            Company = 'Tester',
            Stage__c = stages[0].getValue(),
            Email = 'testStamp@LeadStamperTest.com'
        );
        insert testLead;

        testLead = [
            SELECT
                Id,
                n2de__Is_rejected__c,
                Rejected_Reason__c,
                Stage_Date__c,
                Rejected_Date__c
            FROM Lead
            WHERE Id = :testLead.Id
        ];

        System.assertEquals(
            null,
            testLead.Rejected_Date__c,
            'Rejected Date was assigned at creation.'
        );
        System.assertEquals(
            Date.today(),
            testLead.Stage_Date__c,
            'Stage Date not set correctly.'
        );

        testLead.n2de__Is_rejected__c = true;
        testLead.Rejected_Reason__c = Lead.Rejected_Reason__c.getDescribe()
                .getPicklistValues()[0]
            .getValue();
        update testLead;

        testLead = [
            SELECT Id, Rejected_Date__c
            FROM Lead
            WHERE Id = :testLead.Id
        ];
        System.assertEquals(
            Date.today(),
            testLead.Rejected_Date__c,
            'Rejected Date not set correctly.'
        );
    }
}