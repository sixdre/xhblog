app.config(
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
											'/admin/js/services/articleService.js',
											'/admin/js/controllers/articleCtrl.js'
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
					templateUrl:'/admin/tpl/indep/friends.html',
					controller:"friendCtrl",
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/admin/js/services/friendService.js',
	                                '/admin/js/controllers/friendCtrl.js'
	                          ]);
	                      }]
		            }
				})
				.state("app.catetag",{
					url:"/catetag",
					templateUrl:'/admin/tpl/indep/cate_tag.html',
					controller:'CateTagCtrl',
					resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load([
                                '/admin/js/services/cate_tagService.js',
                                '/admin/js/controllers/cate_tagCtrl.js'
                          ]);
                      }]
	                },
				})
				.state("app.users",{
					url:"/users",
					templateUrl:'/admin/tpl/indep/users.html',
					controller:'userCtrl',
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/admin/js/services/userService.js',
	                                '/admin/js/controllers/userCtrl.js'
	                          ]);
	                      }]
	                },
				})
				.state("app.file",{
					url:"/file",
					templateUrl:'/admin/tpl/indep/file.html',
					controller:'fileCtrl',
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/admin/js/services/fileService.js',
	                                '/admin/js/controllers/fileCtrl.js'
	                          ]);
	                      }]
	                },
				})
				.state('app.setting', {
					abstract: true,
					url: '/setting',
					template: '<div ui-view class="fade-in-up"></div>',
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/admin/js/services/settingService.js',
	                                '/admin/js/controllers/settingCtrl.js'
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