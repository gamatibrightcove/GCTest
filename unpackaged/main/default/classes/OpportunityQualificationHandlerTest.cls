@isTest
public with sharing class OpportunityQualificationHandlerTest {
    @TestSetup
    private static void makeData() {
        UserRole bdrRole = [SELECT Id FROM UserRole WHERE Name = 'BDR' LIMIT 1];
        List<User> users = TestUserProvisioner.getNewUsers(2);
        users[0].UserRoleId = bdrRole.Id;
        TestUserProvisioner.insertUsers(JSON.serialize(users));
    }

    @isTest
    private static void testQualifyAsBdr() {
        User bdr = [
            SELECT Id
            FROM User
            WHERE
                LastName = 'TestUserProvisioner'
                AND UserRole.Name = 'BDR'
                AND IsActive = TRUE
            LIMIT 1
        ];

        Opportunity opp = OpportunityTestFactory.getStageZeroOpp();
        opp.StageName = '0 - Meeting Scheduled';
        opp.OwnerId = bdr.Id;
        insert opp;

        Test.startTest();

        opp = [SELECT Id, StageName FROM Opportunity WHERE Id = :opp.Id];

        System.runAs(bdr) {
            opp.StageName = '0 - Meeting Occurred';
            update opp;
        }

        Test.stopTest();

        opp = [
            SELECT Qualifying_User__c, Qualifier_Role__c
            FROM Opportunity
            WHERE Id = :opp.Id
        ];
        System.assertEquals(
            bdr.Id,
            opp.Qualifying_User__c,
            'BDR was not correctly assigned as the Qualifying User.'
        );
        System.assertEquals(
            'BDR',
            opp.Qualifier_Role__c,
            'BDR was not correctly assigned as the Qualifying User.'
        );
    }

    @isTest
    private static void testQualifyAsNonBdr() {
        User nonBdr = [
            SELECT Id
            FROM User
            WHERE
                LastName = 'TestUserProvisioner'
                AND UserRole.Name != 'BDR'
                AND IsActive = TRUE
            LIMIT 1
        ];

        Opportunity opp = OpportunityTestFactory.getStageZeroOpp();
        opp.StageName = '0 - Meeting Scheduled';
        opp.OwnerId = nonBdr.Id;
        insert opp;

        Test.startTest();

        opp = [SELECT Id, StageName FROM Opportunity WHERE Id = :opp.Id];

        System.runAs(nonBdr) {
            opp.StageName = '0 - Meeting Occurred';
            update opp;
        }

        Test.stopTest();

        opp = [
            SELECT Qualifying_User__c, Qualifier_Role__c
            FROM Opportunity
            WHERE Id = :opp.Id
        ];
        System.assertEquals(
            nonBdr.Id,
            opp.Qualifying_User__c,
            'BDR was not correctly assigned as the Qualifying User.'
        );
        System.assertEquals(
            'Sales Rep',
            opp.Qualifier_Role__c,
            'BDR was not correctly assigned as the Qualifying User.'
        );
    }
}