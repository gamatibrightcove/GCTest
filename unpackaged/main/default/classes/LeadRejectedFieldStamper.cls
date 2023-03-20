/**
 * Tests for this method are found in LeadStamperTest
 */
public with sharing class LeadRejectedFieldStamper extends FieldStamper {
    public override Boolean isQualified(SObject sobj) {
        return (Boolean) sobj.get(Lead.n2de__Is_rejected__c);
    }

    public override void stamp(SObject sobj) {
        sobj.put(Lead.Rejected_Date__c, Date.today());
    }
}