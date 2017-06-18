 // lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      //slimScroll:['/libs/jquery-slimscroll/jquery.slimscroll.min.js']
   })
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  false,
          events: true,
          modules: [
//            {
//                name: 'angularBootstrapNavTree',
//                files: [
//                    '/libs/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
//                    '/libs/angular-bootstrap-nav-tree/dist/abn_tree.css'
//                ]
//            }
          ]
      });
  }])
;