({
	doSearch : function(component, event, helper) {
        helper.helperMethodForSearch(component, event, helper);
        /*component.set("v.IsSpinner",true);
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
            console.log(caseResults.length);
            if (caseResults.length > 0) {
                component.set("v.hasResults",true);
            }
            else{
                component.set("v.hasResults",false);
            }
            component.set("v.IsSpinner",false);
           component.set("v.caseModalIsOpen",true);
        });
        $A.enqueueAction(caseAction);*/
	},
    searchEnter : function(component, event, helper) {
        var isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            console.log('enter2');
            //helper.doSearch(component, event, helper);
            helper.helperMethodForSearch(component, event, helper);
        }  
    },
    changePage : function(component, event, helper) {
        component.set("v.IsSpinner",true);
        var selectedItem = event.currentTarget; 
        var page = selectedItem.dataset.record; 
        component.set("v.page",page);
        console.log("page"+page);
		var action = component.get("c.getSearchResponse");
        action.setParams({
            "term": component.get("v.term"),
            "page": page
        });
        action.setCallback(this, function(response) {
            console.log("response"+response.getReturnValue());
            var requestResults = response.getReturnValue();
			var searchResults = helper.processSearchResults(requestResults);
            console.log("searchResults" +searchResults);
        	component.set("v.searchResults", searchResults);
            component.set("v.IsSpinner",false);
        });
         $A.enqueueAction(action);
    },
    handleClickCase : function(component, event, helper) {
        var selectedItem = event.currentTarget;
        console.log(':::::::'+selectedItem.dataset.recordid);
        component.set("v.caseId",selectedItem.dataset.recordid);
        component.set("v.caseModalIsOpen",true);
    },
  
    handleClickLink : function(component, event, helper) {
        //debugger;
        var selectedItem = event.currentTarget;
        var idstr = selectedItem.getAttribute("data-recordid"); 
        if(idstr != null){
            window.open('/s/case/' + idstr);
        }
    },
    closeModal : function(component, event, helper) {
        component.set("v.caseModalIsOpen",false);
        component.set("v.forumModalIsOpen", false);
    }
})