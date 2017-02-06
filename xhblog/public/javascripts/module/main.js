(function () {
  'use strict';

  angular.module('blog.admin.setting', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  
  function routeConfig($stateProvider, $urlRouterProvider) {
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
	  

  }
})();
