angular.module('app')
  .directive('poinTer', ['$timeout', '$parse',function($timeout, $parse) {
    return {
      restrict: 'AC',
      link: function(scope, ele, attr) {
      	ele.hover(function(){
      		ele.css({
      			"cursor":"pointer"
      		})
      	})
      }
    };
  }]);