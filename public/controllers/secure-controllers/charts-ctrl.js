angular.module("GrantManagerApp")
    .controller("SecureChartsCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {

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



    }]);
