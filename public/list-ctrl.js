angular.module("GrantManagerApp")
    .controller("ListCtrl", ["$scope", "$http", "$location", function($scope, $http, $location){
        
        function refresh(){
            $http
                .get("/api/v1/grants")
                .then(function(response){
                    $scope.grants = response.data;
                });
            $scope.isGrantInfoDisplayed = false;
            $scope.grantId="";
        }
        
        function getResourceList(resource){
            var res = "";
            
            for(var i=0; i< resource.length; i++){
                res = res + "<li>" + resource[i] + "</li>";
            }
            return res;
        }
        
        $scope.showGrant = function(grant){
            document.getElementById("title").innerHTML = grant.title;
            document.getElementById("reference").innerHTML = "<b>Reference: </b>" + grant.reference;
            document.getElementById("leaders").innerHTML = getResourceList(grant.leaders);
            document.getElementById("grantType").innerHTML = "<b>Grant type: </b>" + grant.type;
            document.getElementById("startDate").innerHTML = "<b>Start date: </b>" + grant.startDate;
            document.getElementById("endDate").innerHTML = "<b>End date: </b>" + grant.endDate;
            document.getElementById("fundingOrganizations").innerHTML = getResourceList(grant.fundingOrganizations);
            document.getElementById("teamMembers").innerHTML = getResourceList(grant.teamMembers);
            $scope.isGrantInfoDisplayed=true;
            $scope.idGrant=grant.idGrant;
        }
        
        $scope.deleteGrant = function(){
            $http
                .delete("/api/v1/grants/" + $scope.idGrant)
                .then(function(response){
                    refresh();
                });
        }
        
        $scope.editGrant = function(){
            $location.path("/grant/"+$scope.idGrant);
        }
        
        $scope.createGrant = function(){
            $location.path("/create");
        }

        refresh();
        
        
}]);