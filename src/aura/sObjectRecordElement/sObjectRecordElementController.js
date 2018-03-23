({
    doInit : function(component, event, helper) {
        helper.getTheme(component);
        var theRecord = component.get('v.theRecord');
        var fieldName = component.get('v.fieldName');
        var sObjectFieldMap = component.get("v.sObjectFieldMap");
        var useLDS = component.get("v.useLDS");
        if(useLDS) {
            if (theRecord && theRecord["fields"] && theRecord["fields"][fieldName]) {
                component.set("v.fieldValue", theRecord["fields"][fieldName]["value"]);
                if (fieldName === 'FirstName' || fieldName === 'LastName' || fieldName === 'Name') {
                    component.set("v.nameField", "true");
                } else if (sObjectFieldMap[fieldName][1] === 'EMAIL') {
                    component.set("v.emailField", "true");
                } else if (sObjectFieldMap[fieldName][1] === 'PHONE') {
                    component.set("v.phoneField", "true");
                } else if (sObjectFieldMap[fieldName][1] === 'DATE' || sObjectFieldMap[fieldName][1] === 'DATETIME') {
                    component.set("v.dateField", true);
                } else if (sObjectFieldMap[fieldName][1] === 'REFERENCE') {
                    helper.getLookupValue(component);
                    component.set("v.lookupField", "true");
                } else {
                    component.set("v.regularField", "true");
                }
            }
        }else{
            if (theRecord && theRecord[fieldName]) {
                component.set("v.fieldValue", theRecord[fieldName]);
                if (fieldName === 'FirstName' || fieldName === 'LastName' || fieldName === 'Name') {
                    component.set("v.nameField", "true");
                } else if (sObjectFieldMap[fieldName][1] === 'EMAIL') {
                    component.set("v.emailField", "true");
                } else if (sObjectFieldMap[fieldName][1] === 'PHONE') {
                    component.set("v.phoneField", "true");
                } else if (sObjectFieldMap[fieldName][1] === 'DATE' || sObjectFieldMap[fieldName][1] === 'DATETIME') {
                    component.set("v.dateField", true);
                } else if (sObjectFieldMap[fieldName][1] === 'REFERENCE') {
                    helper.getLookupValue(component);
                    component.set("v.lookupField", "true");
                } else {
                    component.set("v.regularField", "true");
                }
            }
        }
    }
})