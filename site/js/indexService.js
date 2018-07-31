var app = angular.module('commonService',[]);
app.service('cardService', function() {

    // Save service
    this.save = function(tempArr, tempObj){
        tempArr.push(tempObj);
        return tempArr;
    }

    // Delete service
    this.delete = function(tempArr, tempIndex) {
        tempArr.splice(tempIndex, 1);
        return tempArr;
    }

    // Update service
    this.update = function(tempArr, tempObj, tempIndex) {
        tempArr[tempIndex] = tempObj;
        return tempArr;
    }
});
