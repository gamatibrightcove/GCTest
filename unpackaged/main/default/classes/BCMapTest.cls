@isTest
public with sharing class BCMapTest {
    @isTest
    private static void testMultiTypeMethods() {
        List<Contact> contacts = new List<Contact>{
            new Contact(LastName = 'One', Department = 'IT'),
            new Contact(LastName = 'Two', Department = 'IT'),
            new Contact(LastName = 'Three', Department = 'IT'),
            new Contact(LastName = 'Three', Department = 'Finance'),
            new Contact(LastName = 'Three', Department = 'Finance')
        };

        BCMap contactsMap = new BCMap(
            contacts,
            new List<String>{ 'Department' }
        );
        System.assert(!contactsMap.isAllEmpty());
        System.assertEquals(
            2,
            contactsMap.keyAllSet().size(),
            'Incorrect number of keys in map.'
        );

        Map<String, Integer> expectedCounts = new Map<String, Integer>{
            'IT' => 3,
            'Finance' => 2
        };

        for (String department : expectedCounts.keySet()) {
            Integer expectedCount = expectedCounts.get(department);

            Integer actualCount = contactsMap.getAll(department).size();
            System.assertEquals(
                expectedCount,
                actualCount,
                'Incorrect number of records for key "' +
                department +
                '"'
            );

            for (
                Contact contact : (List<Contact>) contactsMap.getAll(department)
            ) {
                System.assertEquals(
                    contact.Department,
                    department,
                    'Incorrect Contact values for key "' +
                    department +
                    '"'
                );
            }
        }

        Integer expectedLegalCount = 20;

        List<Contact> legalContacts = new List<Contact>();
        for (Integer i = 0; i < expectedLegalCount; i++) {
            legalContacts.add(new Contact(Department = 'Legal'));
        }

        contactsMap.putAll(legalContacts);

        System.assertEquals(
            expectedLegalCount,
            contactsMap.getAll('Legal').size(),
            'Incorrect number of returned contacts for Department "Legal"'
        );

        Integer expectedFinanceCount = contactsMap.getAll('Finance').size();

        List<Contact> financeContacts = (List<Contact>) contactsMap.removeAll(
            'Finance'
        );
        System.assertEquals(
            expectedFinanceCount,
            financeContacts.size(),
            'Incorrect number of records removed for Department "Finance"'
        );
        for (Contact financeContact : financeContacts) {
            System.assertEquals(
                'Finance',
                financeContact.Department,
                'Incorrect records were removed for Department "Finance"'
            );
        }
    }

    @isTest
    private static void testSingleTypeMethods() {
        List<Contact> contacts = new List<Contact>{
            new Contact(
                LastName = 'One',
                Email = 'one@testSingleTypeMethods.com'
            ),
            new Contact(
                LastName = 'Two',
                Email = 'two@testSingleTypeMethods.com'
            ),
            new Contact(
                LastName = 'Three',
                Email = 'three@testSingleTypeMethods.com'
            )
        };
        BCMap contactsMap = new BCMap(contacts, new List<String>{ 'Email' });
        System.assert(!contactsMap.isEmpty());
        System.assertEquals(
            contacts.size(),
            contactsMap.keySet().size(),
            'Incorrect number of map keys.'
        );

        for (Contact contact : contacts) {
            System.assert(
                contactsMap.containsKey(contact.Email),
                'Contact Email "' +
                contact.Email +
                '" key missing from map.'
            );
            System.assertEquals(
                contact,
                (Contact) contactsMap.get(contact.Email),
                'Incorrect contact value associated with key "' +
                contact.Email +
                '"'
            );
        }

        Contact newContact = new Contact(Email = 'newcontact@bcmaptest.com');
        contactsMap.put(newContact);
        System.assert(
            contactsMap.containsKey('newcontact@bcmaptest.com'),
            'Contact Email key "newcontact@bcmaptest.com" missing from map.'
        );
        System.assertEquals(
            newContact,
            (Contact) contactsMap.get(newContact.Email),
            'Incorrect contact value associated with key "' +
            newContact.Email +
            '"'
        );

        System.assertEquals(
            newContact,
            (Contact) contactsMap.remove(newContact.Email),
            'Incorrect '
        );
    }
}