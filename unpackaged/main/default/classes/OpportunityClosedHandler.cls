public with sharing class OpportunityClosedHandler extends DomainLogicHandler {
    List<Contact> contacts = new List<Contact>();

    public override void check(SObject newObject, SObject oldObject) {
        Opportunity newOpp = (Opportunity) newObject;
        Opportunity oldOpp = (Opportunity) oldObject;
        if (isQualified(newOpp, oldOpp)) {
            contacts.add(
                new Contact(Id = newOpp.ContactId, Stage__c = 'Recycled')
            );
        }
    }

    public override void processRecords() {
        update contacts;
    }

    Boolean isQualified(Opportunity newOpp, Opportunity oldOpp) {
        return newOpp.IsClosed &&
            isChanged(newOpp, oldOpp) &&
            newOpp.ContactId != null &&
            isRecordTypeQualified(newOpp);
    }

    Boolean isRecordTypeQualified(Opportunity newOpp) {
        List<String> qualifiedRecordTypes = new List<String>{
            'New Business',
            'Add-On',
            'Lead'
        };
        return qualifiedRecordTypes.contains(RecordTypeUtility.getName(newOpp));
    }

    Boolean isChanged(Opportunity newOpp, Opportunity oldOpp) {
        return newOpp.StageName != oldOpp.StageName;
    }
}