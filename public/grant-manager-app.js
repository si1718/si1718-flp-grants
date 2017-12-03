angular.module("GrantManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
    /////////////////////////////////// HIGHCHART THEME START ///////////////////////////////////////////////////

        /**
         * (c) 2010-2017 Torstein Honsi
         *
         * License: www.highcharts.com/license
         * 
         * Sand-Signika theme for Highcharts JS
         * @author Torstein Honsi
         */


        /* global document */
        // Load the fonts
        Highcharts.createElement('link', {
            href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
            rel: 'stylesheet',
            type: 'text/css'
        }, null, document.getElementsByTagName('head')[0]);


        Highcharts.theme = {
            colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee',
                '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
            ],
            chart: {
                backgroundColor: null,
                style: {
                    fontFamily: 'Signika, serif'
                }
            },
            title: {
                style: {
                    color: 'black',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                style: {
                    color: 'black'
                }
            },
            tooltip: {
                borderWidth: 0
            },
            legend: {
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '13px'
                }
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#6e6e70'
                    }
                }
            },
            yAxis: {
                labels: {
                    style: {
                        color: '#6e6e70'
                    }
                }
            },
            plotOptions: {
                series: {
                    shadow: true
                },
                candlestick: {
                    lineColor: '#404048'
                },
                map: {
                    shadow: false
                }
            },

            // Highstock specific
            navigator: {
                xAxis: {
                    gridLineColor: '#D0D0D8'
                }
            },
            rangeSelector: {
                buttonTheme: {
                    fill: 'white',
                    stroke: '#C0C0C8',
                    'stroke-width': 1,
                    states: {
                        select: {
                            fill: '#D0D0D8'
                        }
                    }
                }
            },
            scrollbar: {
                trackBorderColor: '#C0C0C8'
            },

            // General
            background2: '#E0E0E8'

        };
/////////////////////////////////// HIGHCHART THEME END ///////////////////////////////////////////////////
        
        
        
        $routeProvider
            .when("/",{
                templateUrl: "search.html",
                controller : "SearchCtrl"
            }).when("/create", {
                templateUrl: "create.html",
                controller: "CreateCtrl"
            }).when("/grant/:idGrant",{
                templateUrl: "edit.html",
                controller : "EditCtrl"
            }).when("/list",{
                templateUrl:"list.html",
                controller:"ListCtrl"
            }).when("/about",{
                templateUrl:"about.html",
                controller:"AboutCtrl"
            }).when("/charts",{
                templateUrl: "charts.html",
                controller: "ChartsCtrl"
            }).when("/researcherschart", {
                templateUrl: "researchers-chart-integration.html",
                controller: "ResearchersChartCtrl"
            }).when("/grantschart", {
                templateUrl: "basic-grant-chart.html",
                controller: "DepartmentsChartCtrl"
            }).when("/viewgrant/:idGrant",{
                templateUrl: "extended-view.html",
                controller: "ExtendedViewCtrl"
            });
        console.log("App Initialized");
    });