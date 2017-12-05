angular.module("GrantManagerApp")
    .controller("ListCtrl", ["$scope", "$http", "$location", "$routeParams",function($scope, $http, $location, $routeParams){
        
        $scope.grantExists = true;
        
        var queryParam = Object.keys($location.search())[0];
        console.log(queryParam);
        var queryValue = $location.search()[queryParam];
        
        console.log(queryValue);
            
        $scope.back = function() {
            $location.path("/");
        };
            
        function refresh(){
            var apiGetRequest = "/api/v1/grants";
            if(queryParam)
                apiGetRequest = apiGetRequest + "?"+ queryParam + "=" + queryValue;
            $http
                .get(apiGetRequest)
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
            $scope.isGrantInfoDisplayed = false;
            $scope.grantId="";
        }
        
        function getResourceList(resource, urlView){
            var res = "";
            console.log("hskjdahkasjhdkjahd" + urlView);
            for(var i=0; i< resource.length; i++){
                res = res + "<li>";
                if(urlView !== undefined){
                    res  = res + "<a href='" + urlView[i] +  "'>" + resource[i] + "</a>";
                    console.log(res);

                }else{
                    res = res + resource[i];
                }
                res = res + "</li>";
            }
            console.log(res);
            return res;
        }
        
        $scope.showGrant = function(grant){
            document.getElementById("title").innerHTML = grant.title;
            document.getElementById("reference").innerHTML = "<b>Reference: </b>" + grant.reference;
            document.getElementById("leaders").innerHTML = getResourceList(grant.leadersName, grant.leadersViewURL);
            document.getElementById("grantType").innerHTML = "<b>Grant type: </b>" + grant.type;
            document.getElementById("startDate").innerHTML = "<b>Start date: </b>" + grant.startDate;
            document.getElementById("endDate").innerHTML = "<b>End date: </b>" + grant.endDate;
            document.getElementById("fundingOrganizations").innerHTML = getResourceList(grant.fundingOrganizations);
            document.getElementById("teamMembers").innerHTML = getResourceList(grant.teamMembersName, grant.teamMembersViewURL);
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
        
        $scope.extendedView = function(){
            $location.path("/viewgrant/" + $scope.idGrant);
        }

        refresh();
        
}]);