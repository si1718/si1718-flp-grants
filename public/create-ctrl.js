angular.module("GrantManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location",
        function($scope, $http, $location){
            
        $scope.newGrant ={};
        $scope.newGrant.leaders = [];
        $scope.newGrant.fundingOrganizations = [];
        $scope.newGrant.teamMembers = [];
            
        console.log("CreateCtrl initialized");
            
        $scope.cancelGrantCreation = function(){
            $location.path("/list");
        };
        
        $scope.addAttributeItem = function(attribute){
            switch(attribute){
                case "leader":
                    $scope.newGrant.leaders.push(document.getElementById("grantInputLeader").value);
                    document.getElementById("grantInputLeader").value = "";
                    break;
                case "fundingOrganization":
                    $scope.newGrant.fundingOrganizations.push(document.getElementById("grantInputFundingOrganization").value);
                    document.getElementById("grantInputFundingOrganization").value = "";
                    break;
                case "teamMember":
                    $scope.newGrant.teamMembers.push(document.getElementById("grantInputTeamMember").value);
                    document.getElementById("grantInputTeamMember").value = "";
                    break;
                default:
                    break;
            }
            
        }
        
        $scope.deleteResourceItem = function(attribute, index){
            switch(attribute){
                case "leader":
                    $scope.newGrant.leaders.splice(index,1);
                    break;
                case "fundingOrganization":
                    $scope.newGrant.fundingOrganizations.splice(index,1);
                    break;
                case "teamMember":
                    $scope.newGrant.teamMembers.splice(index,1);
                    break;
                default:
                    break;
            }
        }
        
        $scope.commitGrantCreation = function(){
            
            delete $scope.newGrant._id;
            
            var grant = $scope.newGrant;
            if(grant.title == "" || grant.type  == "" || grant.leaders.length == 0 || 
                grant.startDate == "" || grant.endDate == "" || 
                grant.fundingOrganizations.length == 0 || grant.teamMembers.length == 0 || 
                grant.reference == ""){
                    document.getElementById("info").innerHTML = "Please complete all fields";
                    Materialize.toast('Please complete all fields!', 4000, 'red')

            }
            else{
                $http
                    .post("/api/v1/grants", $scope.newGrant)
                    .then(
                        function(response){
                            console.log("Grant created");
                            Materialize.toast('Data was saved succesfully!', 4000, 'green');
                            document.getElementById("info").innerHTML = "Success!";
                            
                            //$location.path("/list");
                        },function(response){
                            if(response.status == 422){
                                console.log("data incomplete!");
                                document.getElementById("info").innerHTML = "Please, complete all fields";
                                Materialize.toast('Please complete all fields!', 4000, 'red');
                            }else if(response.status == 409){
                                console.log("this data already exits!");
                                document.getElementById("info").innerHTML = "There is already a grant with that reference";
                                Materialize.toast('There is already a grant with that reference', 4000, 'red');
                            } else{
                                console.log("unrecognized!");
                                document.getElementById("info").innerHTML = "There was an internal error. Please, try it later";
                                Materialize.toast('There was an internal error. Please, try it later', 4000, 'red');
                            }
                        });
            }
        }
        
    }]);