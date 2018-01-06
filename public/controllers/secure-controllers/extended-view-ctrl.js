angular.module("GrantManagerApp")
    .controller("SecureExtendedViewCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {

            var researchersUrlBase = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers";
            var departmentsUrlBase = "https://si1718-amc-departments.herokuapp.com/api/v1/departments";


            // Check token
            $http
                .get("/api/v1.1/authorized", {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
                })
                .then(function(response) {
                    console.log(response.body)

                }, function(response) {
                    if (response.status == 401) {
                        localStorage.setItem("accessToken", null);
                        localStorage.setItem("profile", null);
                        localStorage.setItem('logged', "false");
                        console.info("Session expired");
                        $location.path("/");
                    }
                });

            $scope.idGrant = $routeParams.idGrant;
            $scope.grantExists = true;

            $scope.back = function() {
                $location.path("/");
            };

            function getResourceList(resource) {
                var res = "";

                for (var i = 0; i < resource.length; i++) {
                    res = res + "<li>" + resource[i] + "</li>";
                }
                return res;
            }

            $http
                .get("/api/v1.1/grants/" + $scope.idGrant, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
                })
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
                        var allRelatedDepartments = [];
                        for (var researcherIndex in grant.leadersName) {
                            var researcher = grant.leadersName[researcherIndex];
                            $http
                                .get(departmentsUrlBase + "?researcher=" + researcher)
                                .then(function(response) {
                                    var department = response.data[0].department;
                                    if (allRelatedDepartments.indexOf(department.idDepartment) == -1) {
                                        var address = response.data[0].address;
                                        document.getElementById("departments").innerHTML =
                                            document.getElementById("departments").innerHTML +
                                            parseDepartment(response.data[0].department, response.data[0].address);
                                        allRelatedDepartments.push(department.idDepartment);
                                    }
                                })
                        }


                    },
                    function(response) {
                        $scope.grantExists = false;
                    }
                );

            function parseDepartment(department, totalAddress) {
                var html = "<li><b>" + department + "</b><ul>";
                for (var addressIndex = 0; addressIndex < totalAddress.length; addressIndex++) {
                    var address = totalAddress[addressIndex];
                    var locationNumber = (addressIndex + 1);
                    html = html + "<p> Location " + locationNumber + ": </p><ul>"
                    if (address !== undefined) {
                        if (address.school !== undefined && address.school.length > 4) {
                            html = html + "<li><p> Address:" + address.school + "</p></li>";
                        }
                        if (address.fax !== undefined && address.fax.length > 2) {
                            html = html + "<li><p> Fax: " + address.fax + "</p></li>";
                        }
                        if (address.tlf !== undefined && address.tlf.length > 2) {
                            html = html + "<li><p> Phone number: " + address.tlf + "</p></li>";
                        }
                        if (address.web !== undefined && address.web.length > 5) {
                            html = html + "<li><p> Web page: " + address.web + "</p></li>";
                        }
                    }
                    html = html + "</ul>"
                }
                return html + "</ul></div></li>";
            }


            function requestElsevier(arrayORCID) {
                var arr = [];

                console.info("HOLAAA");
                
                
                var elsevierURL = "https://api.elsevier.com/content/search/scopus?query=orcid(" + arrayORCID + ")&apiKey=d708d694548e9b9c0352ef22f99d8b1f&httpAccept=application/json";
                var requestElsevier = $http
                    .get(elsevierURL)
                    .then(function(response) {
                        var result = parseInt(response.data["search-results"]["opensearch:totalResults"]);
                        console.info(result);
                        if (result == 1) {
                            $scope.countResearcher += 1;
                        }
                    }, function(error) {
                        swal("There are problems with Elsevier. Try later. Thank you so much!", null, "info");
                    });

                //arr.push(requestElsevier);
            }

            //requestElsevier("");

        }
    ]);
