angular.module("GrantManagerApp")
    .controller("SecureDepartmentsChartCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);

        // My API data
        var myAPIdata = {};

        // Data
        var grantQuantity = 0;
        var leadersPerGrantSum = 0;
        var teamMembersPerGrantSum = 0;
        var fundingOrganizationsPerGrantSum = 0;
        var leadersPerGrantAverage = 0;
        var teamMembersPerGrantAverage = 0;
        var fundingOrganizationsPerGrantAverage = 0;


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

        $http
            .get("/api/v1.1/grants", {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
            })
            .then(function(response) {
                myAPIdata = response.data;
                grantQuantity = myAPIdata.length;

                for (var grantIndex in myAPIdata) {
                    var grant = myAPIdata[grantIndex];
                    
                    if (grant.teamMembers !== null)
                        leadersPerGrantSum += grant.teamMembers.length;
                    if (grant.leaders !== null)
                        teamMembersPerGrantSum += grant.leaders.length;
                    if (grant.fundingOrganizations !== null)
                        fundingOrganizationsPerGrantSum += grant.fundingOrganizations.length;
                        
                    console.log(leadersPerGrantSum);
                    console.log(teamMembersPerGrantSum);
                    console.log(fundingOrganizationsPerGrantSum);
                }
                Highcharts.chart('highchart_view', {
                    chart: {
                        type: 'pyramid'
                    },
                    title: {
                        text: 'Entities participating in ' + grantQuantity + ' grants',
                        x: -50
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b> ({point.y:,.0f})',
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                softConnector: true
                            },
                            center: ['40%', '50%'],
                            width: '80%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Unique users',
                        data: [
                            ['Team members', teamMembersPerGrantSum],
                            ['Funding organizations', fundingOrganizationsPerGrantSum],
                            ['Leaders', leadersPerGrantSum]
                        ]
                    }]
                });
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
