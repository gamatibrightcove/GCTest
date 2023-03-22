/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class DistributionEngineGlobal {
    global DistributionEngineGlobal() {

    }
    global static Map<Id,Boolean> getAvailabilityByUser(String userId) {
        return null;
    }
    global static Map<Id,Map<Id,Boolean>> getUserAvailabilityAllTeams() {
        return null;
    }
    global static Boolean hasSchedulerFailed() {
        return null;
    }
    global static void runHealthChecker() {

    }
    global static void toggleUsers(List<n2de.DistributionEngineGlobal.ToggleUserDTO> toggleUserList) {

    }
global class ToggleUserDTO {
    global String offlineReason;
    global Boolean online;
    global Id userId;
    global ToggleUserDTO() {

    }
    global ToggleUserDTO(Id userId, Boolean online, String offlineReason) {

    }
}
}
