angular.module("GrantManagerApp")
    .controller("SecureListCtrl", ["$scope", "$http", "$location", "$routeParams", "$log", function($scope, $http, $location, $routeParams, $log) {

        $scope.grantExists = true;
        $scope.limit = 5;
        $scope.maxPagesLinksView = 5;

        $scope.page = 1;
        $scope.totalItems = 0;

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


        function extractCount() {
            var apiCountRequest = "/api/v1.1/resultsCount"
            if (queryParam)
                apiCountRequest = apiCountRequest + "?" + queryParam + "=" + queryValue;
            $http
                .get(apiCountRequest, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
                })
                .then(function(count) {
                    $scope.totalItems = count.data.total;
                }, function(error) {
                    if (error.status == 401) {
                        localStorage.setItem("accessToken", null);
                        localStorage.setItem("profile", null);
                        localStorage.setItem('logged', "false");
                        console.info("Session expired");
                        $location.path("/");
                    }
                    else {
                        $scope.errorMessage = "An unexpected error has ocurred.";
                        $scope.paginationError = true;
                    }
                });
        }

        var queryParam = Object.keys($location.search())[0];
        console.log(queryParam);
        var queryValue = $location.search()[queryParam];
        console.log(queryValue);


        $scope.back = function() {
            $location.path("/").search({});
        };

        function refresh() {
            console.log("Refresh called");
            console.log("Page number: " + $scope.page);
            var apiGetRequest = "/api/v1.1/grants?limit=" + $scope.limit + "&skip=" + (($scope.page - 1) * $scope.limit);
            if (queryParam)
                apiGetRequest = apiGetRequest + "&" + queryParam + "=" + queryValue;

            $http
                .get(apiGetRequest, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
                })
                .then(
                    function(response) {
                        if (response.data.length == 0)
                            $scope.grantExists = false;
                        else
                            $scope.grants = response.data;
                        console.log($scope.grants)
                    },
                    function(response) {
                        if (response.status == 401) {
                            localStorage.setItem("accessToken", null);
                            localStorage.setItem("profile", null);
                            localStorage.setItem('logged', "false");
                            console.info("Session expired");
                            $location.path("/");
                        }
                        else {
                            $scope.grantExists = false;
                        }
                    }
                );
            $scope.isGrantInfoDisplayed = false;
            $scope.grantId = "";
        }

        function getResourceList(resource, urlView) {
            var res = "";

            for (var i = 0; i < resource.length; i++) {
                res = res + "<li>";
                if (urlView !== undefined) {
                    res = res + "<a href='" + urlView[i] + "'>" + resource[i] + "</a>";
                    console.log(res);

                }
                else {
                    res = res + resource[i];
                }
                res = res + "</li>";
            }
            console.log(res);
            return res;
        }

        $scope.showGrant = function(grant) {
            document.getElementById("title").innerHTML = grant.title;
            document.getElementById("reference").innerHTML = "<b>Reference: </b>" + grant.reference;
            document.getElementById("leaders").innerHTML = getResourceList(grant.leadersName, grant.leadersViewURL);
            document.getElementById("grantType").innerHTML = "<b>Grant type: </b>" + grant.type;
            document.getElementById("startDate").innerHTML = "<b>Start date: </b>" + grant.startDate;
            document.getElementById("endDate").innerHTML = "<b>End date: </b>" + grant.endDate;
            document.getElementById("fundingOrganizations").innerHTML = getResourceList(grant.fundingOrganizations);
            document.getElementById("teamMembers").innerHTML = getResourceList(grant.teamMembersName, grant.teamMembersViewURL);
            $scope.isGrantInfoDisplayed = true;
            $scope.idGrant = grant.idGrant;
        }

        $scope.deleteGrant = function() {
            $http
                .delete("/api/v1.1/grants/" + $scope.idGrant, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
                })
                .then(function(response) {
                    refresh();
                }, function(response) {
                    if (response.status == 401) {
                        localStorage.setItem("accessToken", null);
                        localStorage.setItem("profile", null);
                        localStorage.setItem('logged', "false");
                        console.info("Session expired");
                        $location.path("/");
                    }
                });
        }

        $scope.editGrant = function() {
            $location.path("/secure/grant/" + $scope.idGrant).search({});
        }

        $scope.createGrant = function() {
            $location.path("/secure/create").search({});
        }

        $scope.extendedView = function() {
            $location.path("/secure/viewgrant/" + $scope.idGrant).search({});
        }


        $scope.pageChanged = function() {
            refresh();
        }

        extractCount()
        refresh();

    }]);
