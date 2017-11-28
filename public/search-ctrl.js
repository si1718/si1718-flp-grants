angular.module("GrantManagerApp")
   .controller("SearchCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
   
        $scope.goToAllGrants = function(){
            $location.path("/list");
        }

}]);