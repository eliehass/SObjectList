({
    getLookupValue : function(component) {
        var fieldName = component.get('v.fieldName');
        var theRecord = component.get('v.theRecord');
        var nameField;
        var namePart1;
        if(fieldName.indexOf('__c') === -1){
            namePart1 = fieldName.substring(0, fieldName.indexOf('Id'));
            nameField = namePart1 + '.Name';
        }else{
            namePart1 = fieldName.substring(0, fieldName.indexOf('__c'));
            nameField = namePart1 + '__r.Name';
            namePart1 = namePart1 + '__r';
        }

        var action = component.get("c.getRecordName");
        action.setParams({
            recordId: theRecord.Id,
            fieldName: nameField,
            objectName: component.get("v.sObjectAPIName")
        });
        action.setStorable();

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                if(response.getReturnValue()[namePart1]){
                    component.set("v.fieldValue", response.getReturnValue()[namePart1].Name);
                    component.set("v.lookupId", response.getReturnValue()[namePart1].Id);
                }
            }
        });
        $A.enqueueAction(action);
    },

    getTheme : function(component) {

        var action = component.get("c.getUIThemeDescription");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var theTheme = response.getReturnValue();
                if(theTheme === 'Theme2' || theTheme === 'Theme3'){
                    component.set("v.isClassic", true);
                }else{
                    component.set("v.isClassic", false);
                }
            }
        });
        $A.enqueueAction(action);
    }
})