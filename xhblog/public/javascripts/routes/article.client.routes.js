var uetrue=null;
angular.module('webapp')
.config(function ($stateProvider, $urlRouterProvider) {

     $urlRouterProvider.when("", "/list");

     $stateProvider
      	.state("editor", {
            url: "/editor",
            templateUrl: "/tpl/editor.html",
           /* controller:'editorCtrl'*/
        })
        .state("list", {
            url: "/list",
            templateUrl: "/tpl/list.html"
        })
        .state("search", {
            url: "/search",
            templateUrl: "/tpl/search.html"
        })
       
});