app.run(
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.$state.isLogin = false;
		}
	)
	.config(
		function($stateProvider, $urlRouterProvider,$locationProvider) {
			$locationProvider.hashPrefix('');  //处理地址栏中的!问题
			
			$urlRouterProvider.when("", "app/article/publish");
			$urlRouterProvider
				.otherwise('/access/404');
			$stateProvider
				.state('app', {
					abstract: true,
					url: '/app',
					templateUrl: '/admin/tpl/blocks/app.html'
				})
				.state('app.dashboard', {
					url: '/dashboard',
					templateUrl: '/admin/tpl/dashboard.html',
					/*onEnter:function($rootScope){
					
					},
					onExit:function(){
						console.log(2);
					}*/
					/*controllerProvider :function($rootScope){
						if($rootScope.$state.isLogin == false){
		                    $rootScope.$state.go('access.signin');
		                }
		                return function(){};
					}*/
				})
				.state('app.article', {
					abstract: true,
					url: '/article',
					template: '<div ui-view class="fade-in-up"></div>',			//new
					resolve: {
	                      deps: ['$ocLazyLoad',
	                        function( $ocLazyLoad ){
	                          return $ocLazyLoad.load(['ui.select']).then(
	                              function(){
	                                  return $ocLazyLoad.load([
											'/admin/js/services/article.client.service.js',
											'/admin/js/controllers/article.client.controller.js'
	                                  ]);
	                              }
	                          );
	                      }]
	                  }					
				})
				.state('app.article.publish', {					//new
					url: '/publish',
					templateUrl: '/admin/tpl/article/publish.html',
					controller:'articlePublishCtrl',
				})
				.state('app.article.list', {					//new
					url: '/list/:page',
					templateUrl: '/admin/tpl/article/list.html',
					controller:"articleListCtrl"
				})
				.state('app.article.search', {
					url: '/search',
					templateUrl: '/admin/tpl/article/search.html',
					controller:'articleSearchCtrl'
				})
				.state("app.friend",{
					url:"/friend",
					templateUrl:'/admin/tpl/setting/newFriend.html',
					controller:"settingCtrl",
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/admin/js/services/setting.client.service.js',
	                                '/admin/js/controllers/setting.client.controller.js'
	                          ]);
	                      }]
		            }
				})
				.state("app.category",{
					url:"/category",
					templateUrl:'/admin/tpl/cate_tag.html',
					controller:'categoryCtrl',
					resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load([
                                '/admin/js/services/cate_tag.client.service.js',
                                '/admin/js/controllers/cate_tag.client.controller.js'
                          ]);
                      }]
	                },
				})
				.state("app.users",{
					url:"/users",
					templateUrl:'/admin/tpl/users.html'
				})
				.state('app.setting', {
					abstract: true,
					url: '/setting',
					template: '<div ui-view class="fade-in-up"></div>',
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/admin/js/services/setting.client.service.js',
	                                '/admin/js/controllers/setting.client.controller.js'
	                          ]);
	                      }]
		                },
				})
				.state('app.setting.banner', {
					url: '/banner',
					templateUrl: '/admin/tpl/setting/banner.html'
				})
				.state('app.setting.banner.add', {
					url: '/banner_add',
					templateUrl: '/admin/tpl/setting/banner_add.html'
				})
				.state('app.setting.banner.list', {
					url: '/banner_list',
					templateUrl: '/admin/tpl/setting/banner_list.html'
				})
				.state('access', {
	                  url: '/access',
	                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
	             })
	             .state('access.signin', {
	            	 url: '/signin',
	                  templateUrl: '/admin/tpl/signin.html',
	                  resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad ){
	                          return uiLoad.load( ['/admin/js/controllers/signin.js'] );
	                      }]
	                  }
	             })
	             .state('access.signup', {
	            	 url: '/signup',
	                  templateUrl: '/admin/tpl/signup.html',
	                  resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad ){
	                          return uiLoad.load( ['/admin/js/controllers/signup.js'] );
	                      }]
	                  }
	             })
				.state('access.404', {
	                  url: '/404',
	                  templateUrl: '/admin/tpl/404.html'
	             })
				
		}
	);