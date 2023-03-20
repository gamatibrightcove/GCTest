@isTest
public with sharing class TriggerUtilityTest {
    @isTest
    private static void testIsChanged() {
        Set<SObjectField> fields = new Set<SObjectField>{
            Contact.Email,
            Contact.FirstName
        };
        Contact newContact = new Contact(
            Email = 'newContact@testIsChanged.com',
            FirstName = 'New'
        );
        Contact oldContact = new Contact(
            Email = 'newContact@testIsChanged.com',
            FirstName = 'New'
        );

        Boolean expected = false;
        Boolean actual = TriggerUtility.isChanged(
            newContact,
            oldContact,
            fields
        );
        System.assertEquals(
            expected,
            actual,
            'Change in field values was not correctly identified.'
        );

        oldContact = new Contact(
            Email = 'oldContact@testIsChanged.com',
            FirstName = 'New'
        );

        expected = true;
        actual = TriggerUtility.isChanged(newContact, oldContact, fields);
        System.assertEquals(
            expected,
            actual,
            'Change in field values was not correctly identified.'
        );
    }

    @isTest
    private static void testGetChangedFields() {
        Set<SObjectField> fields = new Set<SObjectField>{
            Contact.Email,
            Contact.FirstName
        };
        Contact newContact = new Contact(
            Email = 'newContact@testIsChanged.com',
            FirstName = 'New'
        );
        Contact oldContact = new Contact(
            Email = 'newContact@testIsChanged.com',
            FirstName = 'New'
        );

        Set<SObjectField> changedFields = TriggerUtility.getChangedFields(
            newContact,
            oldContact,
            fields
        );

        System.assertEquals(
            0,
            changedFields.size(),
            'Identical records returned a changed field.'
        );

        newContact.FirstName = 'Newer';

        changedFields = TriggerUtility.getChangedFields(
            newContact,
            oldContact,
            fields
        );
        System.assertEquals(
            1,
            changedFields.size(),
            'Incorrect number of changed fields returned.'
        );
        System.assert(
            changedFields.contains(Contact.FirstName),
            'Incorrect SObjectField returned.'
        );
    }
}