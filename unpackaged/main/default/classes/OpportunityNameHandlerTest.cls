@isTest
public class OpportunityNameHandlerTest {
    @TestSetup
    static void setupData() {
        insert generateTestAccounts(5, false);
        insert generateTestAccounts(5, true);
    }

    @isTest
    static void testShortOpportunityName() {
        List<Account> accounts = [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE 'Short%'
        ];
        Map<Id, String> recordTypeNameByIdMap = getRecordTypeNameMap();
        String createdDate =
            String.valueOf(Date.today().month()) +
            '/' +
            String.valueOf(Date.today().year());

        List<Opportunity> opportunities = new List<Opportunity>();

        for (Account acc : accounts) {
            for (Id recordTypeId : recordTypeNameByIdMap.keySet()) {
                opportunities.add(
                    new Opportunity(
                        AccountId = acc.Id,
                        Name = 'Test Name',
                        StageName = '1 - Discovery',
                        CloseDate = Date.today(),
                        RecordTypeId = recordTypeId
                    )
                );
            }
        }

        Test.startTest();

        insert opportunities;

        Test.stopTest();

        List<Opportunity> updatedOpportunities = [
            SELECT
                Id,
                Name,
                CreatedDate,
                AccountId,
                Account.Name,
                RecordType.Name
            FROM Opportunity
            WHERE Id IN :opportunities
        ];

        for (Opportunity opp : updatedOpportunities) {
            System.assertEquals(
                opp.Account.Name +
                ' - ' +
                opp.RecordType.Name +
                ' - ' +
                createdDate,
                opp.Name,
                'Opportunity Name did not update properly'
            );
        }
    }

    @isTest
    static void testLongOpportunityName() {
        List<Account> accounts = [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE 'Long%'
        ];
        Map<Id, String> recordTypeNameByIdMap = getRecordTypeNameMap();
        String createdDate =
            String.valueOf(Date.today().month()) +
            '/' +
            String.valueOf(Date.today().year());

        List<Opportunity> opportunities = new List<Opportunity>();

        for (Account acc : accounts) {
            for (Id recordTypeId : recordTypeNameByIdMap.keySet()) {
                opportunities.add(
                    new Opportunity(
                        AccountId = acc.Id,
                        Name = 'Test Name',
                        StageName = '1 - Discovery',
                        CloseDate = Date.today(),
                        RecordTypeId = recordTypeId
                    )
                );
            }
        }

        Test.startTest();

        insert opportunities;

        Test.stopTest();

        List<Opportunity> updatedOpportunities = [
            SELECT
                Id,
                Name,
                CreatedDate,
                AccountId,
                Account.Name,
                RecordType.Name
            FROM Opportunity
            WHERE Id IN :opportunities
        ];

        for (Opportunity opp : updatedOpportunities) {
            System.assertEquals(
                opp.Account.Name.left(80).trim() +
                ' - ' +
                opp.RecordType.Name +
                ' - ' +
                createdDate,
                opp.Name,
                'Opportunity Name did not update properly'
            );
        }
    }

    private static List<Account> generateTestAccounts(
        Integer numberOfAccounts,
        Boolean longNames
    ) {
        List<Account> results = new List<Account>();
        for (Integer i = 0; i < numberOfAccounts; i++) {
            if (!longNames) {
                results.add(
                    new Account(
                        Name = 'Short Test Account ' + String.valueOf(i)
                    )
                );
            } else {
                results.add(
                    new Account(
                        Name = 'Long ' +
                            generateLongString(100) +
                            ' ' +
                            String.valueOf(i)
                    )
                );
            }
        }
        return results;
    }

    private static String generateLongString(Integer numberOfCharacters) {
        String chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        String result = '';

        for (Integer i = 0; i < numberOfCharacters; i++) {
            Integer index = Math.mod(
                Math.abs(Crypto.getRandomInteger()),
                chars.length()
            );
            result += chars.substring(index, index + 1);
        }

        return result;
    }

    private static Map<Id, String> getRecordTypeNameMap() {
        Map<Id, String> results = new Map<Id, String>();
        List<Schema.RecordTypeInfo> recordTypeInfos = Opportunity.SObjectType.getDescribe()
            .getRecordTypeInfos();

        for (Schema.RecordTypeInfo rti : recordTypeInfos) {
            if (rti.getName() != 'Master') {
                results.put(rti.getRecordTypeId(), rti.getName());
            }
        }

        return results;
    }
}
