angular.module("GrantManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location",
        function($scope, $http, $location) {

            var researchersUrlBase = "https://si1718-dfr-researchers.herokuapp.com";
            var apiGetResearch = "/api/v1/researchers";
            var guiUrlResearch = "/#!/researchers";

            $scope.newGrant = {};
            $scope.newGrant.leaders = [];
            $scope.newGrant.fundingOrganizations = [];
            $scope.newGrant.teamMembers = [];
            $scope.newGrant.keywords = [];

            // Input for array attributes
            $scope.grantInputLeader = "";
            $scope.grantInputFundingOrganization = "";
            $scope.grantInputTeamMember = "";
            $scope.grantInputKeyword = "";

            // Urls for researchers
            var urlLeader = "";
            var urlViewLeader = "";
            var urlTeamMember = "";
            var urlViewTeamMember = "";

            // Check enough length in attribute item 
            $scope.validLengthForFundingOrganization = function() { return $scope.grantInputFundingOrganization.length >= 4; };
            $scope.validLengthForKeyword = function() { return $scope.grantInputKeyword.length >= 4; };

            // Search variables
            $scope.enoughLettersInLeaderSearch = function() { return $scope.grantInputLeader.length >= 3; };
            $scope.errorInLeaderSearch = "";
            $scope.validResearchersApiResponseForLeaderSearch = false;
            $scope.enoughLettersInTeamMemberSearch = function() { return $scope.grantInputTeamMember.length >= 3; };
            $scope.errorInTeamMemberSearch = "";
            $scope.validResearchersApiResponseForTeamMemberSearch = false;

            console.log("CreateCtrl initialized");

            $scope.cancelGrantCreation = function() {
                $location.path("/");
            };

            $scope.addAttributeItem = function(attribute) {
                console.log(attribute);
                switch (attribute) {
                    case "leader":
                        $scope.newGrant.leaders.push(urlLeader);
                        if ($scope.newGrant.leadersName !== undefined){
                            $scope.newGrant.leadersName.push($scope.grantInputLeader);
                        }else{
                            $scope.newGrant.leadersName = [$scope.grantInputLeader];
                        }
                        if ($scope.newGrant.leadersViewURL !== undefined){
                            $scope.newGrant.leadersViewURL.push(urlViewLeader);
                        }else{
                            $scope.newGrant.leadersViewURL = [urlViewLeader];
                        }
                        $scope.grantInputLeader = "";
                        $scope.validResearchersApiResponseForLeaderSearch = false;
                        break;
                    case "fundingOrganization":
                        $scope.newGrant.fundingOrganizations.push($scope.grantInputFundingOrganization);
                        $scope.grantInputFundingOrganization = "";
                        break;
                    case "teamMember":
                        $scope.newGrant.teamMembers.push(urlTeamMember);
                        if ($scope.newGrant.teamMembersName !== undefined){
                            $scope.newGrant.teamMembersName.push($scope.grantInputTeamMember);
                        }else{
                            $scope.newGrant.teamMembersName = [$scope.grantInputTeamMember];
                        }
                        if ($scope.newGrant.teamMembersViewURL !== undefined){
                            $scope.newGrant.teamMembersViewURL.push(urlViewTeamMember);
                        }else{
                            $scope.newGrant.teamMembersViewURL = [urlViewTeamMember];
                        }
                        $scope.grantInputTeamMember = "";
                        $scope.validResearchersApiResponseForTeamMemberSearch = false;
                        console.log($scope.newGrant.teamMembersName.length)
                        break;
                    case "keyword":
                        $scope.newGrant.keywords.push($scope.grantInputKeyword);
                        $scope.grantInputKeyword = "";
                        break;
                    default:
                        break;
                }

            }

            $scope.deleteAttributeItem = function(attribute, index) {
                switch (attribute) {
                    case "leader":
                        $scope.newGrant.leaders.splice(index, 1);
                        $scope.newGrant.leadersName.splice(index, 1);
                        break;
                    case "fundingOrganization":
                        $scope.newGrant.fundingOrganizations.splice(index, 1);
                        break;
                    case "teamMember":
                        $scope.newGrant.teamMembers.splice(index, 1);
                        $scope.newGrant.teamMembersName.splice(index, 1);
                        break;
                    case "keyword":
                        $scope.newGrant.keywords.splice(index, 1);
                        break;
                    default:
                        break;
                }
            }

            $scope.commitGrantCreation = function() {

                delete $scope.newGrant._id;

                var grant = $scope.newGrant;
                if (grant.title == "" || grant.type == "" || grant.leaders.length == 0 ||
                    grant.startDate == "" || grant.endDate == "" ||
                    grant.fundingOrganizations.length == 0 || grant.teamMembers.length == 0 ||
                    grant.reference == "") {
                    document.getElementById("info").innerHTML = "Please complete all fields";
                    Materialize.toast('Please complete all fields!', 4000, 'red')

                }
                else {
                    $http
                        .post("/api/v1/grants", $scope.newGrant)
                        .then(
                            function(response) {
                                console.log("Grant created");
                                Materialize.toast('Data was saved succesfully!', 4000, 'green');
                                document.getElementById("info").innerHTML = "Success!";

                                //$location.path("/list");
                            },
                            function(response) {
                                if (response.status == 422) {
                                    console.log("data incomplete!");
                                    document.getElementById("info").innerHTML = "Please, complete all fields";
                                    Materialize.toast('Please complete all fields!', 4000, 'red');
                                }
                                else if (response.status == 409) {
                                    console.log("this data already exits!");
                                    document.getElementById("info").innerHTML = "There is already a grant with that reference";
                                    Materialize.toast('There is already a grant with that reference', 4000, 'red');
                                }
                                else {
                                    console.log("unrecognized!");
                                    document.getElementById("info").innerHTML = "There was an internal error. Please, try it later";
                                    Materialize.toast('There was an internal error. Please, try it later', 4000, 'red');
                                }
                            });
                }
            }

            $scope.checkResearcher = function(idInput) {
                var searchFragment = getFragmentFromInput(idInput);
                var apiCallQuery = researchersUrlBase + apiGetResearch +"?search=" + searchFragment;
                console.log(apiCallQuery);
                $http
                    .get(apiCallQuery)
                    .then(function(response) {
                            if (response.data.length != 0) {
                                console.log("The first research output is: " + response.data[0].orcid);
                                showError(idInput, "");
                                insertResultInInput(idInput, response.data[0].name);
                                saveUrlsTemporally(idInput, 
                                    researchersUrlBase + apiGetResearch + "/" + response.data[0].idResearcher,
                                    researchersUrlBase + guiUrlResearch + "/" + response.data[0].idResearcher + "/view");
                            enableInsertButton(idInput);
                        }
                        else {
                            console.log("Sorry, there are not any coincidence");
                            showError(idInput, "Sorry, there are not any coincidence");
                        }

                    },
                    function(response) {
                        console.log("There was an error");
                        showError(idInput, "There was a server error. Please, try it later");
                    })
        }

        function getFragmentFromInput(idInput) {
            var res = "";
            switch (idInput) {
                case "leader":
                    res = $scope.grantInputLeader;
                    break;
                case "teamMember":
                    res = $scope.grantInputTeamMember;
                    break;
                default:
                    break;
            }
            return res;
        }

        function insertResultInInput(idInput, text) {
            switch (idInput) {
                case "leader":
                    console.log(text);
                    $scope.grantInputLeader = text;
                    break;
                case "teamMember":
                    $scope.grantInputTeamMember = text;
                    break;
                default:
                    break;
            }
        }

            function saveUrlsTemporally(idInput, url, urlView) {
                switch (idInput) {
                    case "leader":
                        console.log("leader: " + url);
                        urlLeader = url;
                        urlViewLeader = urlView;
                        break;
                    case "teamMember":
                        console.log("teammember: " + url);
                        urlTeamMember = url;
                        urlViewTeamMember = urlView;
                        break;
                    default:
                        break;
                }
            }

        function enableInsertButton(idInput) {
            switch (idInput) {
                case "leader":
                    $scope.validResearchersApiResponseForLeaderSearch = true;
                    break;
                case "teamMember":
                    $scope.validResearchersApiResponseForTeamMemberSearch = true;
                    break;
                default:
                    break;
            }
        }

        function showError(idInput, errorMessage) {
            switch (idInput) {
                case "leader":
                    $scope.errorInLeaderSearch = errorMessage;
                    break;
                case "teamMember":
                    $scope.errorInTeamMemberSearch = errorMessage;
                    break;
                default:
                    break;
            }
        }

    }]);
