window._snapinsSnippetSettingsFile = (function () {
    // A global variable named "language" contains the language used for routing

    embedded_svc.snippetSettingsFile.directToButtonRouting = function (prechatFormData) {
        
        if (prechatFormData[2].value) {
            embedded_svc.snippetSettingsFile.extraPrechatFormDetails[0].value = "Yes";
        } else {
            embedded_svc.snippetSettingsFile.extraPrechatFormDetails[0].value = "No";
        }

        console.log("Call customer value: " + embedded_svc.snippetSettingsFile.extraPrechatFormDetails[0].value);
        console.log("Language: " + language);

        if (language == 'Japanese') {
            return "5738F000000Gnp1" /*"5731O0000008kSC"*/;
        } else if (language == 'English') {
            return /*"5731O0000008kS7"*/ "5738F000000GnQn";
        } else {
            return /*"5731O0000008kS7"*/ "5738F000000GnQn";
        }
    }

    embedded_svc.snippetSettingsFile.extraPrechatFormDetails = [{
        "label": "Call Customer",
        "value": "None",
        "displayToAgent": true,
        "transcriptFields": [ "CallCustomer__c" ]
    }, {
        "label": "Case Origin",
        "value": "Live Chat",
        "displayToAgent": false
    }];

    embedded_svc.snippetSettingsFile.extraPrechatInfo  = [{
        "entityName": "Case",
        "showOnCreate": true,
        "saveToTranscript": "CaseId",
        "entityFieldMaps": [{
            "isExactMatch": false,
            "fieldName": "Origin",
            "doCreate": true,
            "doFind": false,
            "label": "Case Origin"
        }]
    }];

    embedded_svc.snippetSettingsFile.autoOpenPostChat = true;

})();