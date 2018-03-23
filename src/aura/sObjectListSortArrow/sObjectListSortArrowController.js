({
    doInit : function(component, event, helper) {
        var sortState = component.get('v.sortState');
        var fieldName = component.get('v.fieldName');
        component.set("v.fieldValue", sortState[fieldName]);
    }
})