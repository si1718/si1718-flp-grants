angular.module("GrantManagerApp")
    .controller("DepartmentsChartCtrl", ["$scope", "$http", function($scope, $http) {

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

        $http
            .get("/api/v1/grants")
            .then(function(response) {
                myAPIdata = response.data;
                grantQuantity = myAPIdata.length;

                for (var grantIndex in myAPIdata) {
                    var grant = myAPIdata[grantIndex];
                    leadersPerGrantSum += grant.teamMembers.length;
                    teamMembersPerGrantSum += grant.leaders.length;
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
            });




    }]);
