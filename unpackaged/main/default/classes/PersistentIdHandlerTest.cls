@isTest
public with sharing class PersistentIdHandlerTest {
    @TestSetup
    private static void setup() {
        TestUserProvisioner provisioner = new TestUserProvisioner(
            UserInfo.getUserId()
        );
        provisioner.setLicenses(
            new List<String>{ 'SalesforceCPQ_CPQStandardPerm' }
        );
        provisioner.setPermissions(
            new List<String>{ 'Global_Read', 'SteelBrickCPQUser' }
        );
        provisioner.assignPermissions();
    }

    @isTest
    private static void testLeadGuidAssignment() {
        Lead record = new Lead(
            Email = 'testLeadGuidAssignment@example.com',
            LastName = 'lead',
            Company = 'lead'
        );
        insert record;

        record = [SELECT Id, GUID__c FROM Lead WHERE Id = :record.Id];
        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testCaseGuidAssignment() {
        Account account = new Account(Name = 'testCaseGuidAssignment');
        insert account;
        Contact contact = new Contact(
            Email = 'testLeadGuidAssignment@example.com',
            LastName = 'lead',
            AccountId = account.Id
        );
        insert contact;
        Case record = new Case(AccountId = account.Id, ContactId = contact.Id);
        insert record;

        record = [SELECT Id, GUID__c FROM Case WHERE Id = :record.Id];
        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testContactGuidAssignment() {
        Account account = new Account(Name = 'testContactGuidAssignment');
        Contact record = new Contact(
            Email = 'testLeadGuidAssignment@example.com',
            LastName = 'lead',
            AccountId = account.Id
        );
        insert record;

        record = [SELECT Id, GUID__c FROM Contact WHERE Id = :record.Id];
        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testOppGuidAssignment() {
        Account account = new Account(Name = 'PersistentIdHandlerTest');
        insert account;

        Opportunity opp = OpportunityTestFactory.getStage1Opp(account.Id);
        insert opp;

        opp = [SELECT Id, GUID__c FROM Opportunity WHERE Id = :opp.Id];

        System.assertNotEquals(
            null,
            opp.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            opp.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testOrderGuidAssignment() {
        Account account = new Account(Name = 'testOrderGuidAssignment');
        insert account;

        Order record = new Order(
            AccountId = account.Id,
            Name = 'PersistentIdHandlerTest',
            EffectiveDate = Date.today(),
            Status = Order.Status.getDescribe().getPicklistValues()[0]
                .getValue()
        );
        insert record;

        record = [SELECT Id, GUID__c FROM Order WHERE Id = :record.Id];

        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testCustomPricingGuidAssignment() {
        Custom_Pricing__c record = new Custom_Pricing__c(
            Maximum_Quantity__c = 10,
            Minimum_Quantity__c = 1,
            Type__c = Custom_Pricing__c.Type__c.getDescribe()
                    .getPicklistValues()[0]
                .getValue()
        );
        insert record;

        record = [
            SELECT Id, GUID__c
            FROM Custom_Pricing__c
            WHERE Id = :record.Id
        ];

        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testQuoteGuidAssignment() {
        SBQQ__Quote__c record = new SBQQ__Quote__c();
        insert record;

        record = [SELECT Id, GUID__c FROM SBQQ__Quote__c WHERE Id = :record.Id];

        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testSubscriptionGuidAssignment() {
        SBQQ__Subscription__c record = new SBQQ__Subscription__c(
            SBQQ__Quantity__c = 1
        );
        insert record;

        record = [
            SELECT Id, GUID__c
            FROM SBQQ__Subscription__c
            WHERE Id = :record.Id
        ];

        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testContractGuidAssignment() {
        Account account = new Account(Name = 'testContractGuidAssignment');
        insert account;

        Contract record = new Contract(AccountId = account.Id);
        insert record;

        record = [SELECT Id, GUID__c FROM Contract WHERE Id = :record.Id];

        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testBlockPricingGuidAssignment() {
        SBQQ__BlockPrice__c record = new SBQQ__BlockPrice__c();
        insert record;

        record = [
            SELECT Id, GUID__c
            FROM SBQQ__BlockPrice__c
            WHERE Id = :record.Id
        ];

        System.assertNotEquals(
            null,
            record.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            record.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testAccountGuidAssignment() {
        Account account = new Account(Name = 'PersistentIdHandlerTest');
        insert account;

        account = [SELECT Id, GUID__c FROM Account WHERE Id = :account.Id];

        System.assertNotEquals(
            null,
            account.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            account.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testProductGuidAssignment() {
        Product2 product = new Product2(Name = 'PersistentIdHandlerTest');
        insert product;

        product = [SELECT Id, GUID__c FROM Product2 WHERE Id = :product.Id];

        System.assertNotEquals(
            null,
            product.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            product.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testProductOptionGuidAssignment() {
        SBQQ__ProductOption__c productOption = new SBQQ__ProductOption__c(
            SBQQ__Number__c = 1
        );
        insert productOption;

        productOption = [
            SELECT Id, GUID__c
            FROM SBQQ__ProductOption__c
            WHERE Id = :productOption.Id
        ];

        System.assertNotEquals(
            null,
            productOption.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            productOption.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testProductFeatureGuidAssignment() {
        SBQQ__ProductFeature__c productFeature = new SBQQ__ProductFeature__c(
            Name = 'PersistentIdHandlerTest',
            SBQQ__Number__c = 1
        );
        insert productFeature;

        productFeature = [
            SELECT Id, GUID__c
            FROM SBQQ__ProductFeature__c
            WHERE Id = :productFeature.Id
        ];

        System.assertNotEquals(
            null,
            productFeature.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            productFeature.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testPricebookGuidAssignment() {
        Pricebook2 pricebook = new Pricebook2(Name = 'PersistentIdHandlerTest');
        insert pricebook;

        pricebook = [
            SELECT Id, GUID__c
            FROM Pricebook2
            WHERE Id = :pricebook.Id
        ];

        System.assertNotEquals(
            null,
            pricebook.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            pricebook.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }

    @isTest
    private static void testOpportunitySplitGuidAssignment() {
        Account account = new Account(
            Name = 'testOpportunitySplitGuidAssignment'
        );
        insert account;

        Opportunity opp = OpportunityTestFactory.getStage1Opp(account.Id);
        insert opp;

        Test.startTest();

        User user = TestUserProvisioner.getNewUser();
        user.LastName = 'TestUserProvisioner';
        List<User> users = new List<User>{ user };
        TestUserProvisioner.insertUsers(JSON.serialize(users));

        Test.stopTesT();

        user = [
            SELECT Id
            FROM User
            WHERE LastName = 'TestUserProvisioner'
            LIMIT 1
        ];
        OpportunitySplit split = new OpportunitySplit(
            OpportunityId = opp.Id,
            SplitOwnerId = user.Id
        );
        insert split;

        split = [SELECT Id, GUID__c FROM OpportunitySplit WHERE Id = :split.Id];

        System.assertNotEquals(
            null,
            split.GUID__c,
            'GUID not assigned to record.'
        );
        System.assertEquals(
            36,
            split.GUID__c.length(),
            'Invalid GUID length assigned.'
        );
    }
}