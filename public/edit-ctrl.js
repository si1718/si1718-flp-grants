angular.module("GrantManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location){
            $scope.idGrant = $routeParams.idGrant;
            $scope.grantExists = true;
            console.log("EditCtrl initialized for grant with id: " + $scope.idGrant);
            $http
                .get("/api/v1/grants/" + $scope.idGrant)
                .then(
                    function(response){
                        $scope.updatedGrant = response.data;
                    },function(response){
                        $scope.grantExists = false;
                    }
                );
            
        $scope.cancelGrantEdition = function(){
            $location.path("/list");
        };
        
        $scope.addAttributeItem = function(attribute){
            switch(attribute){
                case "leader":
                    $scope.updatedGrant.leaders.push(document.getElementById("grantInputLeader").value);
                    document.getElementById("grantInputLeader").value = "";
                    break;
                case "fundingOrganization":
                    $scope.updatedGrant.fundingOrganizations.push(document.getElementById("grantInputFundingOrganization").value);
                    document.getElementById("grantInputFundingOrganization").value = "";
                    break;
                case "teamMember":
                    $scope.updatedGrant.teamMembers.push(document.getElementById("grantInputTeamMember").value);
                    document.getElementById("grantInputTeamMember").value = "";
                    break;
                default:
                    break;
            }
            
        }
        
        $scope.deleteResourceItem = function(attribute, index){
            switch(attribute){
                case "leader":
                    $scope.updatedGrant.leaders.splice(index,1);
                    break;
                case "fundingOrganization":
                    $scope.updatedGrant.fundingOrganizations.splice(index,1);
                    break;
                case "teamMember":
                    $scope.updatedGrant.teamMembers.splice(index,1);
                    break;
                default:
                    break;
            }
        }
        
        $scope.commitGrantEdition =function(){
            
            delete $scope.updatedGrant._id;
            
            var grant = $scope.updatedGrant;
            
            if(grant.title == "" || grant.type  == "" || grant.leaders.length == 0 || 
                grant.startDate == "" || grant.endDate == "" || 
                grant.fundingOrganizations.length == 0 || grant.teamMembers.length == 0 || 
                grant.reference == ""){
                    document.getElementById("info").innerHTML = "Please complete all fields";
                    Materialize.toast('Please complete all fields!', 4000, 'red');

            }
            else{
                $http
                    .put("/api/v1/grants/"+$scope.idGrant, $scope.updatedGrant)
                    .then(
                        function(response){
                            console.log("Grant updated");
                            
                            Materialize.toast('Data was saved succesfully!', 4000, 'green');
                            document.getElementById("info").innerHTML = "Data was saved";
                            
                        //$location.path("/list");
                        
                        },function(response){
                            if(response.status == 422){
                                console.log("data incomplete!");
                                document.getElementById("info").innerHTML = "Please, complete all fields";
                                Materialize.toast('Please complete all fields!', 4000, 'red');
                            } else{
                                console.log("unrecognized!");
                                document.getElementById("info").innerHTML = "There was an internal error. Please, try it later";
                                Materialize.toast('There was an internal error. Please, try it later', 4000, 'red');
                            }
                        }
                    );
            }
        }
        }]);