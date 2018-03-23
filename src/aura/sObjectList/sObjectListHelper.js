({
    doInitWork : function(component, event, click){
        var sObjectList = component.get("v.sObjectList");
        var sObjectAPIName = component.get("v.sObjectAPIName");
        var parentId = component.get("v.parentId");
        var lookUpFieldName = component.get("v.lookUpFieldName");
        var isProvidedList = component.get("v.isProvidedList");
        this.getObjectFields(component);
        if(parentId){
            this.getRecords(component, sObjectAPIName, lookUpFieldName, parentId);
        }else if(!isProvidedList){
            var emptyList = [];
            component.set("v.recordIdList", emptyList);
            component.set("v.sObjectList", emptyList);
        }
        component.set("v.sObjectListSize", sObjectList.length);
        var sortElement = component.get("v.sortElement");
        var doSort = component.get("v.runInit");
        if(sortElement && doSort){
            component.set("v.runInit", false);
            this.doSort(component, event, false);
            component.set("v.runInit", true);
        }
    },

    setRecordComponents : function(component){
        var emptyList = [];
        component.set("v.recordComponents", emptyList);
        var sObjectFieldAPINames = component.get("v.sObjectFieldAPINames");
        var sObjectFieldMap = component.get("v.sObjectFieldMap");
        var showRemoveColumn = component.get("v.showRemoveColumn");
        var showEditColumn = component.get("v.showEditColumn");
        var showSelectColumn = component.get("v.showSelectColumn");
        var parentObjectAPIName = component.get("v.parentObjectAPIName");
        var sObjectAPIName = component.get("v.sObjectAPIName");
        var componentAttributesMap = {};
        var selectedRecordId = component.get("v.selectedRecordId");
        componentAttributesMap["sObjectFieldAPINames"] = sObjectFieldAPINames;
        componentAttributesMap["sObjectFieldMap"] = sObjectFieldMap;
        componentAttributesMap["showRemoveColumn"] = showRemoveColumn;
        componentAttributesMap["showEditColumn"] = showEditColumn;
        componentAttributesMap["showSelectColumn"] = showSelectColumn;
        componentAttributesMap["parentId"] = parentObjectAPIName;
        componentAttributesMap["sObjectAPIName"] = sObjectAPIName;
        var recordIdList = component.get("v.recordIdList");
        var sObjectList = component.get("v.sObjectList");
        var useLDS = component.get("v.useLDS");
        var clickableRows = component.get("v.clickableRows");
        for(var i = 0; i < sObjectList.length; i = i + 1){
            var sObject = sObjectList[i];
            var attributesMap = {};
            attributesMap["recordId"] = sObject.Id;
            attributesMap["clickableRows"] = clickableRows;
            if(clickableRows && sObject.Id === selectedRecordId){
                attributesMap["isSelected"] = true;
            }
            if(!useLDS){
                attributesMap["theRecord"] = sObject;
                attributesMap["useLDS"] = false;
            }
            if(sObject.Id && (!useLDS || recordIdList.indexOf(sObject.Id) === -1) && sObjectFieldAPINames && (sObjectFieldAPINames.length !== 0)) {
                recordIdList.push(sObject.Id);
                for (var key in componentAttributesMap) {
                    attributesMap[key] = componentAttributesMap[key];
                }
                $A.createComponent(
                    component.get("v.recordComponentName"),
                    attributesMap,
                    function (newComponent, status, errorMessage) {
                        if (status === "SUCCESS") {
                            var componentArray = component.get("v.recordComponents");
                            componentArray.push(newComponent);
                            component.set("v.recordComponents", componentArray);
                            component.set("v.hasComponents", true);
                            component.set("v.recordIdList", recordIdList);
                        }
                    }
                );
            }
        }
    },

    getObjectFields : function(component){
        var action = component.get("c.getFieldSetFields");
        action.setStorable();
        var theObject = component.get("v.sObjectAPIName");
        var theFieldSet = component.get("v.fieldSetName");

        action.setParams({
            sObj: theObject,
            fieldsetName:  theFieldSet,
            limited: false
        });

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var fieldMap = response.getReturnValue();
                var fieldList = [];
                var fieldAPINameList = [];
                component.set("v.sObjectFieldMap", fieldMap);
                for(var key in fieldMap){
                    fieldList.push(fieldMap[key][0]);
                    fieldAPINameList.push(key);
                }
                component.set("v.sObjectFieldAPINames", fieldAPINameList);
            }
        });
        $A.enqueueAction(action);
    },

    doSort : function(component, event, click){
        var emptyList = [];
        component.set("v.recordIdList", emptyList);
        var objectList = component.get("v.sObjectList");
        var sortState = component.get("v.sortState");
        var sortElement;
        if(click === true){
            sortElement = event.currentTarget.id;
            component.set("v.sortElement", sortElement);
        }else{
            sortElement = component.get("v.sortElement");
        }
        var newSortState = {};
        var direction;
        if(sortElement in sortState){
            direction  = sortState[sortElement];
        }else{
            direction = 'asc';
        }
        if(click === true){
            if(direction === 'asc'){
                newSortState[sortElement] = 'desc';
            }else{
                newSortState[sortElement] = 'asc';
            }
        }else{
            newSortState[sortElement] = direction;
        }
        component.set("v.sortState", newSortState);
        var sortedContactList = [];
        var sortedFieldList = [];
        var objectMap = {};
        for (var i = 0; i < objectList.length; i = i + 1) {
            var sortValue = objectList[i][sortElement];
            var theKey = sortValue + objectList[i].Id;
            theKey = theKey.toLowerCase();
            sortedFieldList.push(theKey);
            objectMap[theKey] = objectList[i];
        }
        if(direction === 'desc' && click === true){
            sortedFieldList.sort().reverse();
        }else{
            sortedFieldList.sort();
        }
        for(var i = 0; i < sortedFieldList.length; i = i + 1){
            sortedContactList.push(objectMap[sortedFieldList[i]]);
        }
        component.set("v.sObjectList", sortedContactList);
        component.set("v.isLoading", false);
    },

    getRecords : function(component, sObject, lookUpFieldName, theParentId){
        var action = component.get("c.getChildRecords");

        action.setParams({
            sObj: sObject,
            lookUpFieldName: lookUpFieldName,
            parentId: theParentId
        });

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                var recordIdList = [];
                for(var i = 0; i < records.length; i++){
                    recordIdList.push(records[i].Id);
                }
                var emptyList = [];
                component.set("v.recordIdList", emptyList);
                component.set("v.sObjectList", records);
                //component.set("v.parentId", null);
                //component.set("v.recordIdList", recordIdList);
            }
        });
        $A.enqueueAction(action);
    },

    addToList : function(component, recordId){
        var objectName = component.get("v.sObjectAPIName");
        var action = component.get("c.getRecord");
        action.setStorable();

        action.setParams({
            sObj: objectName,
            recordId: recordId
        });

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = component.get("v.sObjectList");
                var recordIdList = component.get("v.recordIdList");
                if(recordIdList.indexOf(response.getReturnValue().Id) === -1){
                    records.push(response.getReturnValue());
                    recordIdList.push(response.getReturnValue().Id);
                    var emptyList = [];
                    component.set("v.recordIdList", emptyList);
                    component.set("v.sObjectList", records);
                }
            }
        });
        $A.enqueueAction(action);
    }
})