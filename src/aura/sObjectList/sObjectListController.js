({
    doInit : function(component, event, helper) {
        var parentId = component.get("v.parentId");
        var hasParentId = component.get("v.hasParentId");
        if(!hasParentId) {
            helper.doInitWork(component, event, helper);
        }
        if(parentId){
            hasParentId = true;
        }
        component.set("v.hasParentId", hasParentId);
        var isProvidedList = component.get("v.isProvidedList");
        if(isProvidedList){
            helper.setRecordComponents(component);
        }
    },

    sort : function(component, event, helper) {
        component.set("v.runInit", false);
        helper.doSort(component, event, true);
        component.set("v.runInit", true);
    },

    setTheRecordComponents : function(component, event, helper) {
        var isProvidedList = component.get("v.isProvidedList");
        //if(!isProvidedList) {
            helper.setRecordComponents(component);
        //}
    },

    handleRecordSelected : function(component, event, helper){
        var parentObjectAPIName = component.get("v.parentObjectAPIName");
        var eventParent = event.getParam("parentId");
        var parentId = event.getParam("recordId");
        var eventListName = event.getParam("listName");
        var listName = component.get("v.listName");
        if(listName === eventListName){
            helper.addToList(component, parentId);
        }else if(parentObjectAPIName === eventParent){
            component.set("v.parentId", parentId);
            helper.doInitWork(component, event, helper);
        }
        var clickableRows = component.get("v.clickableRows");
        if(clickableRows) {
            if (eventParent.indexOf('SelectedListElement') !== -1) {
                component.set("v.selectedRecordId", parentId);
            }
        }
    },

    handleRecordCreated : function(component, event, helper){
        var sObjectAPIName = component.get("v.sObjectAPIName");
        var eventParent = event.getParam("parentId");
        var parentId = event.getParam("recordId");
        if(sObjectAPIName === eventParent){
            helper.addToList(component, parentId);
        }
    },

    handleRemoveListElement : function(component, event, helper){
        var parentObjectAPIName = component.get("v.parentObjectAPIName");
        var eventParent = event.getParam("parentId");
        var recordId = event.getParam("recordId");
        if(parentObjectAPIName === eventParent){
            var sObjectList = component.get("v.sObjectList");
            var recordIdList = component.get("v.recordIdList");
            var index = recordIdList.indexOf(recordId);
            if (index > -1) {
                sObjectList.splice(index, 1);
            }
            var emptyList = [];
            component.set("v.recordIdList", emptyList);
            component.set("v.sObjectList", sObjectList);
        }
    },
})