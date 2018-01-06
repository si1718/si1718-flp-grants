angular.module("GrantManagerApp")
    .controller("SecureResearchersChartCtrl", ["$scope", "$http", function($scope, $http) {

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);

        var researchersUrlBase = "https://si1718-dfr-researchers.herokuapp.com/api/v1";

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

        // My API data
        var myAPIdata = {};
        var leadersNameList = [];

        // Foreign API data
        var foreignAPIdata = {};
        var professionalSituationList = [];

        // Data
        var professionalSituationSet = [];
        var grantQuantityListByProfessionalSituation = [];
        var grantDurationSumListByProfessionalSituation = [];
        var grantDurationAverageListByProfessionalSituation = [];

        $http
            .get("/api/v1.1/grants", {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem("accessToken") }
            })
            .then(function(response) {
                myAPIdata = response.data;
                $http
                    .get(researchersUrlBase + "/researchers")
                    .then(function(response2) {
                        foreignAPIdata = response2.data;
                        for (var grantIndex in myAPIdata) {
                            var grant = myAPIdata[grantIndex];
                            var grantDateEnd = toDate(grant.endDate);
                            var grantDateStart = toDate(grant.startDate);
                            if (grantDateEnd < 0 || grantDateStart < 0) {
                                continue;

                            }
                            var grantDuration = grantDateEnd.getTime() - grantDateStart.getTime();
                            if (grantDuration < 0) {
                                continue;

                            }
                            var leadersName = grant.leadersName;

                            for (var leaderNameIndex in leadersName) {
                                var leaderName = leadersName[leaderNameIndex];
                                console.log(leaderName);
                                var leaderIndex = leadersNameList.indexOf(leaderName)
                                var leaderProfessionalSituation = "";
                                if (leaderIndex != -1) {
                                    leaderProfessionalSituation = leadersNameList[leaderIndex];
                                }
                                else {
                                    for (var researcherIndex in foreignAPIdata) {
                                        var researcher = foreignAPIdata[researcherIndex];
                                        if (leaderName == researcher.name) {
                                            leaderProfessionalSituation = researcher.professionalSituation;
                                            break;
                                        }
                                    }
                                }
                                var professionalSituationIndex = professionalSituationList.indexOf(leaderProfessionalSituation);
                                if (professionalSituationIndex != -1) {
                                    grantQuantityListByProfessionalSituation[professionalSituationIndex] += 1;
                                    grantDurationSumListByProfessionalSituation[professionalSituationIndex] += grantDuration;
                                }
                                else {
                                    professionalSituationSet.push(leaderProfessionalSituation);
                                    grantQuantityListByProfessionalSituation.push(1);
                                    grantDurationSumListByProfessionalSituation.push(grantDuration);
                                }
                                professionalSituationList.push(leaderProfessionalSituation);
                            }
                        }
                        console.log(professionalSituationSet);
                        console.log(grantQuantityListByProfessionalSituation);
                        console.log(grantDurationSumListByProfessionalSituation);

                        for (var index in professionalSituationSet) {
                            var grantDurationAverage = grantDurationSumListByProfessionalSituation[index] /
                                (grantQuantityListByProfessionalSituation[index] * 1000 * 3600 * 24 * 30);
                            grantDurationAverageListByProfessionalSituation.push(grantDurationAverage)
                        }

                        var statsDate = new Date();
                        console.log(grantDurationAverageListByProfessionalSituation);

                        Highcharts.chart('highchart_view', {
                            chart: {
                                zoomType: 'xy'
                            },
                            title: {
                                text: 'Grant assignation by leader professional situation'
                            },

                            subtitle: {
                                text: statsDate.toString()
                            },
                            xAxis: [{
                                categories: professionalSituationSet
                            }],
                            yAxis: [{
                                labels: {
                                    format: '{value}m',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                title: {
                                    text: 'Duration average (months)',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                }

                            }, {
                                gridLineWidth: 0,
                                labels: {
                                    format: '{value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                title: {
                                    text: 'Number of grants',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                opposite: true
                            }],

                            credits: {
                                enabled: false
                            },
                            tooltip: {
                                shared: true
                            },
                            series: [{
                                name: 'Duration average (months)',
                                type: 'column',
                                data: grantDurationAverageListByProfessionalSituation,
                                tooltip: {
                                    valueSuffix: ' m'
                                }

                            }, {
                                name: 'Number of grants',
                                type: 'column',
                                yAxis: 1,
                                data: grantQuantityListByProfessionalSituation

                            }]

                        });
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


        function toDate(dateString) {
            var date;
            var pars = dateString.split("-");
            if (pars.length == 3) {
                date = new Date(pars[2], pars[1] - 1, pars[0]);
                if (date.toString() == "Invalid Date")
                    date = -1;
            }
            else {
                date = -1;
            }
            return date;
        }
    }]);
