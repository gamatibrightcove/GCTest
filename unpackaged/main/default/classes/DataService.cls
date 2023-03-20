@RestResource(urlMapping='/DataService/*')
global with sharing class DataService {
    static Map<String, Object> requestMap = new Map<String, Object>();
    static Map<String, Object> responseMap = new Map<String, Object>{
        'success' => true
    };
    static String requestName;
    static DataResponse response = new DataResponse();

    @HttpPut
    global static DataResponse doPost() {
        String requestJson = RestContext.request.requestBody.toString();
        try {
            requestMap = (Map<String, Object>) JSON.deserializeUntyped(
                requestJson
            );
            requestName = (String) requestMap.get('requestName');
            processRequest();
        } catch (Exception e) {
            response.success = false;
            response.message =
                'Error: ' +
                e.getMessage() +
                '\n\n\n' +
                e.getStackTraceString();
        }

        return response;
    }

    @HttpGet
    global static DataResponse doGet() {
        RestRequest req = RestContext.request;

        Map<String, String> params = req.params;
        if (!params.containsKey('requestName') || !params.containsKey('guid')) {
            response.success = false;
            response.message = 'Invalid Record Identifier.';
            return response;
        }
        requestName = params.get('requestName');
        requestMap.put('data', params);
        processRequest();
        return response;
    }

    static void processRequest() {
        DataServiceProcessor processor = getProcessor();
        if (processor == null) {
            response.success = false;
            response.message = 'Invalid Request';
            return;
        }

        response.init(processor.execute(requestMap.get('data')));
    }

    private static DataServiceProcessor getProcessor() {
        Data_Servicer__mdt servicerMdt = [
            SELECT
                Apex_Class__c,
                Key_Field__c,
                Id_Field__c,
                (
                    SELECT Source__c, Target__c, SObject__c, Data_Type__c
                    FROM API_Mappings__r
                )
            FROM Data_Servicer__mdt
            WHERE Label = :requestName
        ];
        DataServiceProcessor processor;
        Type myType = Type.forName(servicerMdt.Apex_Class__c);
        if (myType != null) {
            processor = (DataServiceProcessor) myType.newInstance();
            processor.init(servicerMdt);
        }

        return processor;
    }

    global class DataResponse {
        String data;
        Boolean success;
        String message;

        public void init(Map<String, Object> processorData) {
            this.success = (Boolean) processorData.get('success');
            if (processorData.containsKey('message')) {
                this.message = (String) processorData.get('message');
            }
            if (processorData.containsKey('data')) {
                this.data = Json.serialize(processorData.get('data'));
            }
        }
    }
}