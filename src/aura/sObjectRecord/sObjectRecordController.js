({
    refreshRecord : function(component, event, helper) {
        /*var changeType = event.getParams().changeType;
        if(changeType === "LOADED") {
            component.find("theRecordData").reloadRecord();
        }
        if(changeType === "CHANGED") {
            component.find("theRecordData").reloadRecord();
        }*/
    },

    removeElement : function(component, event, helper) {
        var theRecord = component.get("v.theRecord");
        var useLDS = component.get("v.useLDS");
        var recordId;
        if(theRecord && useLDS){
            recordId = theRecord["fields"]["Id"]["value"];
        }else if(theRecord && !useLDS){
            recordId = theRecord.Id;
        }
        if(recordId){
            var removeListElement = $A.get("e.c:removeListElement");
            var parentId = component.get("v.parentId");
            removeListElement.setParams({
                "recordId" : recordId,
                "parentId" : parentId
            });
            removeListElement.fire();
        }
    },

    editRecord : function(component, event, helper) {
        var recordSelectedEvent = $A.get("e.c:recordSelected");
        recordSelectedEvent.setParams({
            "recordId": 'edit',
            "parentId": 'edit'
        });
        recordSelectedEvent.fire();
        var editRecordEvent = $A.get("e.force:editRecord");
        var useLDS = component.get("v.useLDS");
        if(useLDS) {
            editRecordEvent.setParams({
                "recordId": component.get("v.theRecord")["fields"]["Id"]["value"]
            });
        }else{
            editRecordEvent.setParams({
                "recordId": component.get("v.theRecord").Id
            });
        }
        //if($A.get("$Browser.formFactor") === 'DESKTOP') {
            editRecordEvent.fire();
        /*}else {
            component.set("v.editMobile", true);
        }*/
    },

    handleEditMobile : function(component, event, helper) {
        var editMobile = component.get("v.editMobile");
        if(editMobile){
            component.set("v.editMobile", false);
            var editRecordEvent = $A.get("e.force:editRecord");
            var useLDS = component.get("v.useLDS");
            if(useLDS) {
                editRecordEvent.setParams({
                    "recordId": component.get("v.theRecord")["fields"]["Id"]["value"]
                });
            }else{
                editRecordEvent.setParams({
                    "recordId": component.get("v.theRecord").Id
                });
            }
            editRecordEvent.fire();
        }
    },

    selectRecord : function(component, event, helper) {
        helper.selectTheRecord(component);
    },

    clickRow : function(component, event, helper) {
        var clickableRows = component.get("v.clickableRows");
        if(clickableRows){
            helper.selectTheRecord(component);
        }
    },

    handleRecordSelected : function(component, event, helper) {
        var clickableRows = component.get("v.clickableRows");
        if(clickableRows){
            var recordId = component.get("v.recordId");
            var selectedValue = event.getParam("recordId");
            var eventObject = event.getParam("parentId");
            if (eventObject.indexOf('SelectedListElement') !== -1) {
                if(recordId === selectedValue){
                    component.set("v.isSelected", " slds-is-selected");
                }else{
                    component.set("v.isSelected", "");
                }
            }
        }
    }
})