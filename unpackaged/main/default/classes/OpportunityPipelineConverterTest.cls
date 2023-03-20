@isTest
public with sharing class OpportunityPipelineConverterTest {
    @TestSetup
    static void makeData() {
        List<Account> accounts = new List<Account>{
            new Account(Name = 'Customer', Account_Stage__c = 'Customer'),
            new Account(Name = 'Prospect', Account_Stage__c = 'Prospect')
        };
        insert accounts;

        List<Opportunity> opps = new List<Opportunity>{
            new Opportunity(
                AccountId = accounts[0].Id,
                RecordTypeId = RecordTypeUtility.getId(
                    Opportunity.getSObjectType(),
                    'Lead'
                ),
                CloseDate = Date.today().addYears(1),
                StageName = '0 - Meeting Pending'
            ),
            new Opportunity(
                AccountId = accounts[1].Id,
                RecordTypeId = RecordTypeUtility.getId(
                    Opportunity.getSObjectType(),
                    'Lead'
                ),
                CloseDate = Date.today().addYears(1),
                StageName = '0 - Meeting Pending'
            )
        };
        insert opps;
    }

    @isTest
    static void testConvert() {
        List<Opportunity> opps = [
            SELECT Id, Convert_to_Pipeline__c
            FROM Opportunity
            WHERE RecordType.Name = 'Lead'
        ];

        for (Opportunity opp : opps) {
            opp.Convert_to_Pipeline__c = true;
        }

        Test.startTest();
        update opps;
        Test.stopTest();

        opps = [
            SELECT
                Id,
                Account.Account_Stage__c,
                Account.Name,
                RecordType.Name,
                StageName
            FROM Opportunity
            WHERE Id IN :opps
        ];
        for (Opportunity opp : opps) {
            switch on opp.Account.Account_Stage__c {
                when 'Customer' {
                    System.assertEquals(
                        'Add-On',
                        opp.RecordType.Name,
                        'Incorrect Record Type for Customer: ' +
                        opp.Account.Name
                    );
                }
                when else {
                    System.assertEquals(
                        'New Business',
                        opp.RecordType.Name,
                        'Incorrect Record Type for Prospect: ' +
                        opp.Account.Name
                    );
                }
            }
            System.assertEquals(
                '1 - Discovery',
                opp.StageName,
                'Stage was incorrectly set for converted Opportunity.'
            );
        }
    }
}