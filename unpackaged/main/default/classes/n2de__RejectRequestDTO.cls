/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class RejectRequestDTO {
    @InvocableVariable(label='Reason to reject' description='The reason to reject the record' required=true)
    global String reason;
    @InvocableVariable(label='Record id' description='The id of the record to reject' required=true)
    global Id recordId;
    global RejectRequestDTO() {

    }
    global RejectRequestDTO(Id recordId, String reason) {

    }
}
