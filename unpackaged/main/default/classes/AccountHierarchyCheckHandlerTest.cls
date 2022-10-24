@isTest
public class AccountHierarchyCheckHandlerTest {
    private static Map<String, RecordTypeInfo> recordTypeInfosByName = Account.getSObjectType()
        .getDescribe(SObjectDescribeOptions.DEFERRED)
        .getRecordTypeInfosByName();

    @TestSetup
    static void setupPermissions() {
        //make sure running user has the correct permission to see the field

        if (!hasRequiredPermissionSet()) {
            Id accountReadGlobalPermission = [
                SELECT Id, Name
                FROM PermissionSet
                WHERE Name = 'Account_Read_Global'
            ]
            .Id;

            insert new PermissionSetAssignment(
                AssigneeId = UserInfo.getUserId(),
                PermissionSetId = accountReadGlobalPermission
            );
        }
    }

    @isTest
    static void testSetPendingHierarchyReview() {
        List<Account> accounts = new List<Account>{
            new Account(
                Name = 'Customer 1',
                RecordTypeId = recordTypeInfosByName.get('Customer')
                    .getRecordTypeId()
            ),
            new Account(
                Name = 'Customer 2',
                RecordTypeId = recordTypeInfosByName.get('Customer')
                    .getRecordTypeId()
            ),
            new Account(
                Name = 'Partner',
                RecordTypeId = recordTypeInfosByName.get('Partner')
                    .getRecordTypeId()
            )
        };

        insert accounts;

        Test.startTest();

        accounts = [
            SELECT Id, RecordType.Name, ParentId, Pending_Hierarchy_Review__c
            FROM Account
            WHERE Id IN :accounts
        ];

        for (Account account : accounts) {
            Boolean expected = account.RecordType.Name == 'Customer'
                ? true
                : false;
            System.assertEquals(
                expected,
                account.Pending_Hierarchy_Review__c,
                'Pending Hierarchy Review was not set correct for ' +
                account.RecordType.Name
            );
            account.Pending_Hierarchy_Review__c = false;
        }

        update accounts;

        accounts[0].ParentId = accounts[1].Id;
        update accounts[0];

        Test.stopTest();

        Account childAccount = [
            SELECT Id, Pending_Hierarchy_Review__c
            FROM Account
            WHERE Id = :accounts[0].Id
        ];

        System.assertEquals(
            true,
            childAccount.Pending_Hierarchy_Review__c,
            'Pending Hierarchy Review was not set on an updated child Customer Account'
        );
    }

    private static Boolean hasRequiredPermissionSet() {
        Id userId = UserInfo.getUserId();

        List<PermissionSetAssignment> currentAssignments = [
            SELECT Id, PermissionSet.Name, PermissionSetId
            FROM PermissionSetAssignment
            WHERE
                AssigneeId = :userId
                AND PermissionSet.Name = 'Account_Read_Global'
        ];

        return currentAssignments.size() > 0;
    }
}
