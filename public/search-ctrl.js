angular.module("GrantManagerApp")
   .controller("SearchCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
       
        $scope.searchValue = "";
        $scope.searchField = "";
        
        $scope.searchWithFilter = function(){
            $http
                .get("/api/v1/grants" + $scope.idGrant)
                .then(
                    function(response){
                        $scope.updatedGrant = response.data;
                    },function(response){
                        $scope.grantExists = false;
                    }
                );
        }
        
        $scope.setSearchField = function(idField){
            $scope.searchField = idField;
        }
        
        $scope.goToAllGrants = function(){
            $location.path("/list");
        }

}]);