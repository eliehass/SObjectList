({
    doInit : function(component, event, helper) {
        var sObjectFieldMap = component.get('v.sObjectFieldMap');
        var fieldName = component.get('v.fieldName');
        var fieldValue =  sObjectFieldMap[fieldName][0];
        fieldValue = fieldValue.replace(' ID', '');
        component.set("v.fieldValue", fieldValue);
    }
})