angular.module("GrantManagerApp")
    .controller("ExtendedViewCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
            
            var researchersUrlBase = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers";
            var departmentsUrlBase = "https://si1718-amc-departments.herokuapp.com/api/v1/departments";
            
            $scope.idGrant = $routeParams.idGrant;
            $scope.grantExists = true;

            $scope.back = function() {
                $location.path("/");
            };
            
            function getResourceList(resource){
                var res = "";
                
                for(var i=0; i< resource.length; i++){
                    res = res + "<li>" + resource[i] + "</li>";
                }
                return res;
            }
            
            $http
                .get("/api/v1/grants/" + $scope.idGrant)
                .then(
                    function(response) {
                        var grant = response.data;
                        document.getElementById("title").innerHTML = grant.title;
                        document.getElementById("reference").innerHTML = "<b>Reference: </b>" + grant.reference;
                        document.getElementById("leaders").innerHTML = getResourceList(grant.leadersName);
                        document.getElementById("grantType").innerHTML = "<b>Grant type: </b>" + grant.type;
                        document.getElementById("startDate").innerHTML = "<b>Start date: </b>" + grant.startDate;
                        document.getElementById("endDate").innerHTML = "<b>End date: </b>" + grant.endDate;
                        document.getElementById("fundingOrganizations").innerHTML = getResourceList(grant.fundingOrganizations);
                        document.getElementById("teamMembers").innerHTML = getResourceList(grant.teamMembersName);
                    },
                    function(response) {
                        $scope.grantExists = false;
                    }
                );
        }
    ]);
