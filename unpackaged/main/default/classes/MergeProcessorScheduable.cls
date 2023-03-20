public with sharing class MergeProcessorScheduable implements Schedulable {
    public void execute(SchedulableContext ctx) {
        System.enqueueJob(new AccountMergerQueueable());
    }
}