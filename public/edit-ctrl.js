angular.module("GrantManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {

            var researchersUrlBase = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers";

            $scope.idGrant = $routeParams.idGrant;
            $scope.grantExists = true;

            // Input for array attributes
            $scope.grantInputLeader = "";
            $scope.grantInputFundingOrganization = "";
            $scope.grantInputTeamMember = "";
            $scope.grantInputKeyword = "";

            // Urls for researchers
            var urlLeader = "";
            var urlTeamMember = "";

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

            console.log("EditCtrl initialized for grant with id: " + $scope.idGrant);

            $http
                .get("/api/v1/grants/" + $scope.idGrant)
                .then(
                    function(response) {
                        $scope.updatedGrant = response.data;
                    },
                    function(response) {
                        $scope.grantExists = false;
                    }
                );

            $scope.cancelGrantEdition = function() {
                $location.path("/list");
            };

            $scope.addAttributeItem = function(attribute) {
                console.log(attribute);
                switch (attribute) {
                    case "leader":
                        $scope.updatedGrant.leaders.push(urlLeader);
                        if ($scope.updatedGrant.leadersName !== undefined)
                            $scope.updatedGrant.leadersName.push($scope.grantInputLeader);
                        else
                            $scope.updatedGrant.leadersName = [$scope.grantInputLeader];

                        $scope.grantInputLeader = "";
                        $scope.validResearchersApiResponseForLeaderSearch = false;
                        break;
                    case "fundingOrganization":
                        $scope.updatedGrant.fundingOrganizations.push($scope.grantInputFundingOrganization);
                        $scope.grantInputFundingOrganization = "";
                        break;
                    case "teamMember":
                        $scope.updatedGrant.teamMembers.push(urlTeamMember);
                        if ($scope.updatedGrant.teamMembersName !== undefined)
                            $scope.updatedGrant.teamMembersName.push($scope.grantInputTeamMember);
                        else
                            $scope.updatedGrant.teamMembersName = [$scope.grantInputTeamMember];
                        $scope.grantInputTeamMember = "";
                        $scope.validResearchersApiResponseForTeamMemberSearch = false;
                        break;
                    case "keyword":
                        if ($scope.updatedGrant.keywords !== undefined)
                            $scope.updatedGrant.keywords.push($scope.grantInputKeyword);
                        else
                            $scope.updatedGrant.keywords = [$scope.grantInputKeyword];
                        $scope.grantInputKeyword = "";
                        break;
                    default:
                        break;
                }

            }

            $scope.deleteAttributeItem = function(attribute, index) {
                switch (attribute) {
                    case "leader":
                        $scope.updatedGrant.leaders.splice(index, 1);
                        $scope.updatedGrant.leadersName.splice(index, 1);
                        break;
                    case "fundingOrganization":
                        $scope.updatedGrant.fundingOrganizations.splice(index, 1);
                        break;
                    case "teamMember":
                        $scope.updatedGrant.teamMembers.splice(index, 1);
                        $scope.updatedGrant.teamMembersName.splice(index, 1);
                        break;
                    case "keyword":
                        $scope.updatedGrant.keywords.splice(index, 1);
                        break;
                    default:
                        break;
                }
            }

            $scope.commitGrantEdition = function() {

                delete $scope.updatedGrant._id;

                var grant = $scope.updatedGrant;

                if (grant.title == "" || grant.type == "" || grant.leaders.length == 0 ||
                    grant.startDate == "" || grant.endDate == "" ||
                    grant.fundingOrganizations.length == 0 || grant.teamMembers.length == 0 ||
                    grant.reference == "") {
                    document.getElementById("info").innerHTML = "Please complete all fields";
                    Materialize.toast('Please complete all fields!', 4000, 'red');

                }
                else {
                    $http
                        .put("/api/v1/grants/" + $scope.idGrant, $scope.updatedGrant)
                        .then(
                            function(response) {
                                console.log("Grant updated");

                                Materialize.toast('Data was saved succesfully!', 4000, 'green');
                                document.getElementById("info").innerHTML = "Data was saved";

                                //$location.path("/list");

                            },
                            function(response) {
                                if (response.status == 422) {
                                    console.log("data incomplete!");
                                    document.getElementById("info").innerHTML = "Please, complete all fields";
                                    Materialize.toast('Please complete all fields!', 4000, 'red');
                                }
                                else {
                                    console.log("unrecognized!");
                                    document.getElementById("info").innerHTML = "There was an internal error. Please, try it later";
                                    Materialize.toast('There was an internal error. Please, try it later', 4000, 'red');
                                }
                            }
                        );
                }
            }

            $scope.checkResearcher = function(idInput) {
                var searchFragment = getFragmentFromInput(idInput);
                var apiCallQuery = researchersUrlBase + "?search=" + searchFragment;
                console.log(apiCallQuery);
                $http
                    .get(apiCallQuery)
                    .then(function(response) {
                        if (response.data.length != 0) {
                            console.log("The first research output is: " + response.data[0].orcid);
                            showError(idInput, "");
                            insertResultInInput(idInput, response.data[0].name);
                            saveUrlTemporally(idInput, researchersUrlBase + "/" + response.data[0].idResearcher)
                            enableInsertButton(idInput);
                        }
                        else {
                            console.log("Sorry, there are not any coincidence");
                            showError(idInput, "Sorry, there are not any coincidence");
                        }

                    }, function(response) {
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

            function saveUrlTemporally(idInput, url) {
                switch (idInput) {
                    case "leader":
                        console.log("leader: " + url);
                        urlLeader = url;
                        break;
                    case "teamMember":
                        console.log("teammember: " + url);
                        urlTeamMember = url;
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

        }
    ]);
