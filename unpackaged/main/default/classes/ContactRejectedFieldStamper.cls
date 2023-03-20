/**
 * Tests for this class are found in ContactStamperTest
 */
public with sharing class ContactRejectedFieldStamper extends FieldStamper {
    public override void stamp(SObject sobj) {
        if ((Boolean) sobj.get(Contact.Is_Rejected__c)) {
            sobj.put(Contact.Rejected_Date__c, Date.today());
        }
    }
}