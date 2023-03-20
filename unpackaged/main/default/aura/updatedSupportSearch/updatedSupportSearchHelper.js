({
	helperMethodForSearch : function(component, event, helper) {
		debugger;
        component.set("v.IsSpinner",true);
        component.set("v.page","1");
        component.set("v.hasSearched",true);
        component.set("v.hasResults",true);
        var caseAction = component.get("c.getSearchCases");
        caseAction.setParams({
            "term": component.get("v.term")
        });
        caseAction.setCallback(this, function(response) {
            var caseResults = response.getReturnValue();
            //debugger;
            component.set("v.caseCount", caseResults.length);
            component.set("v.caseResults", caseResults);
            console.log("caseResult Length"+caseResults.length);
            if (caseResults.length > 0) {
                component.set("v.hasResults",true);
            }
            else{
                component.set("v.hasResults",false);
            }
            component.set("v.IsSpinner",false);
           component.set("v.caseModalIsOpen",true);
        });
        $A.enqueueAction(caseAction);
	}
})