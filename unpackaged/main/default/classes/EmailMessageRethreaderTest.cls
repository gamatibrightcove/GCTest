@isTest
public with sharing class EmailMessageRethreaderTest {
    @TestSetup
    static void makeData() {
        Case legacyCase = new Case();
        insert legacyCase;

        Case newCase = new Case(GUID__c = legacyCase.Id);
        insert newCase;
    }
}