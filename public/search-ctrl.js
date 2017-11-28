angular.module("GrantManagerApp")
   .controller("SearchCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
       
        $scope.searchValue = "";
        $scope.searchField = "";
        
        $scope.searchWithFilter = function(){
            $location.path("/list/" + $scope.searchField + "/" + $scope.searchValue);
        }
        
        $scope.setSearchField = function(idField){
            $scope.searchField = idField;
        }
        
        $scope.goToAllGrants = function(){
            $location.path("/list");
        }

}]);