public with sharing class OpportunityStageDateStamper extends FieldStamper {
    @TestVisible
    private static Map<String, SObjectField> stageFieldMap = new Map<String, SObjectField>{
        '1 - Discovery' => Opportunity.Discovery_Stage_Set_Date__c,
        '2 - Demo' => Opportunity.Demo_Stage_Set_Date__c,
        '3 - Solution Design & Evaluation' => Opportunity.Solution_Design_Stage_Set_Date__c,
        '4 - Negotiation' => Opportunity.Negotiation_Stage_Set_Date__c,
        '0 - Meeting Pending' => Opportunity.Meeting_Pending_Stage_Set_Date__c,
        '0 - Meeting Scheduled' => Opportunity.Meeting_Scheduled_Stage_Set_Date__c,
        '0 - Meeting Occurred' => Opportunity.Meeting_Occurred_Stage_Set_Date__c
    };

    public override void stamp(SObject sobj) {
        String stageName = (String) sobj.get(Opportunity.StageName);
        if (stageFieldMap.containsKey(stageName)) {
            SObjectField field = stageFieldMap.get(stageName);
            sobj.put(field, Date.today());
        }
    }
}