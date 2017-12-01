angular.module("GrantManagerApp")
   .controller("SearchCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        
        $scope.searchField = "title";
        $scope.searchValue = "";
        
        
        $scope.searchWithFilter = function(){
            $location.path("/list").search($scope.searchField, $scope.searchValue);
        }
        
        $scope.setSearchField = function(idField){
            $scope.searchField = idField;
        }
        
        $scope.goToAllGrants = function(){
            $location.path("/list");
        }

}]);