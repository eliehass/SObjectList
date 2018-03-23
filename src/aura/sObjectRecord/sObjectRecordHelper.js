({
	selectTheRecord : function(component) {
        var recordSelectedEvent = $A.get("e.c:recordSelected");
        var useLDS = component.get("v.useLDS");
        if(useLDS){
            var recordId = component.get("v.theRecord")["fields"]["Id"]["value"];
        }else{
            var recordId = component.get("v.theRecord").Id;
        }
        var parentId = component.get("v.parentId");
        recordSelectedEvent.setParams({
            "recordId": recordId,
            "parentId": 'SelectedListElement-' + parentId
        });
        recordSelectedEvent.fire();
	}
})