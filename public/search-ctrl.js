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
        
        $scope.searchWithFilter = function(searchField) {
            $http.get("https://si1718-flp-grants.herokuapp.com/#!/")
                .then(
                    function(response){
                        if(response.data.length == 0)
                            $scope.grantExists = false;
                        else
                            $scope.grants = response.data;
                        console.log($scope.grants)
                    }, function(response){
                        $scope.grantExists = false;
                    }
                );
        }

}]);