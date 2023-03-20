public with sharing class ExceptionHandler {
    public static void process(Exception e, String source) {
        insert new Log__c(
            Source__c = source,
            Text__c = e.getMessage() + '\n' + e.getStackTraceString()
        );
    }
}