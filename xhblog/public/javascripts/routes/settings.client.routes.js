angular.module('webapp')
.config(function ($stateProvider, $urlRouterProvider) {

     $urlRouterProvider.when("", "/banner");

     $stateProvider
      	.state("banner", {
            url: "/banner",
            templateUrl: "/tpl/banner.html",
        })
        .state("friends", {
            url: "/friends",
            templateUrl: "/tpl/friends.html"
        })
       
});