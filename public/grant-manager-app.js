angular.module("GrantManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
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
            });
        console.log("App Initialized");
    });