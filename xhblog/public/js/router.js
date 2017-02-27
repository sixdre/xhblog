app.run(
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	)
	.config(
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise('/app/article/editor');
			$stateProvider
				.state('app', {
					abstract: true,
					url: '/app',
					templateUrl: '/tpl/admin_tpl/blocks/app.html'
	
				})
				.state('app.dashboard', {
					url: '/dashboard',
					templateUrl: '/tpl/admin_tpl/dashboard.html',
				})
				.state('app.calendar', {
					url: '/calendar',
					templateUrl: '/tpl/admin_tpl/app_calendar.html',
					// use resolve to load other dependences
					resolve: {
						deps: ['$ocLazyLoad', 'uiLoad',
							function($ocLazyLoad, uiLoad) {
								return uiLoad.load(
									['/vendor/jquery/fullcalendar/fullcalendar.css',
										'/vendor/jquery/fullcalendar/theme.css',
										'/vendor/jquery/jquery-ui-1.10.3.custom.min.js',
										'/vendor/libs/moment.min.js',
										'/vendor/jquery/fullcalendar/fullcalendar.min.js',
										'/js/app/calendar/calendar.js'
									]
								).then(
									function() {
										return $ocLazyLoad.load('ui.calendar');
									}
								)
							}
						]
					}
				})
				.state('app.article', {
					abstract: true,
					url: '/article',
					templateUrl: '/tpl/admin_tpl/article/article.html',
					/*controller:function($state){
						$state.go('app.article.editor');
					},*/
					controller: 'articleCtrl',
					resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load([
                                '/js/services/article.client.services.js',
                                '/js/controllers/article/article.client.controllers.js'
                          ]);
                      }]
	                }
					
				})
				.state('app.article.editor', {
					url: '/editor',
					templateUrl: '/tpl/admin_tpl/article/editor.html',
					resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load([
                             '/js/controllers/article/editor.client.controllers.js'
                         ]);
                      }]
	                }
				})
				.state('app.article.list', {
					url: '/list/:page',
					templateUrl: '/tpl/admin_tpl/article/list.html',
					controller:"articleListCtrl"
					/*controller:function($stateParams){
						console.log($stateParams.page)
					}*/
					/*deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load([
                             '/vendor/jquery/datatables/dataTables.bootstrap.css'
                         ]);
                     }]*/
					/*templateUrl: '/tpl/admin_tpl/article/table_list.html',*/
					
				})
				.state('app.article.search', {
					url: '/search',
					templateUrl: '/tpl/admin_tpl/article/search.html',
					
				})
				.state('app.setting', {
					abstract: true,
					url: '/setting',
					template: '<div ui-view class="fade-in-up"></div>',
					/*templateUrl: '/tpl/admin_tpl/setting/setting.html',*/
					/*controller:function($state){
						$state.go('app.setting.banner');
					},*/
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/js/services/setting.client.services.js',
	                                '/js/controllers/setting.client.controllers.js'
	                          ]);
	                      }]
		                },
		           
					
				})
				.state('app.setting.banner', {
					url: '/banner',
					templateUrl: '/tpl/admin_tpl/setting/banner.html',
					
				})
				.state('app.setting.banner.add', {
					url: '/banner_add',
					templateUrl: '/tpl/admin_tpl/setting/banner_add.html',
					
				})
				.state('app.setting.banner.list', {
					url: '/banner_list',
					templateUrl: '/tpl/admin_tpl/setting/banner_list.html',
					
				})
				.state('app.setting.friends', {
					url: '/friends',
					templateUrl: '/tpl/admin_tpl/setting/friends.html',
					
				})
				.state('app.setting.friends.add', {
					url: '/friends_add',
					templateUrl: '/tpl/admin_tpl/setting/friends_add.html',
					controller: 'settingCtrl'
					
				})
				.state('app.setting.friends.list', {
					url: '/friends_list',
					templateUrl: '/tpl/admin_tpl/setting/friends_list.html',
					
				})
				.state('access', {
	                  url: '/access',
	                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
	             })
	             .state('access.signin', {
	            	 url: '/signin',
	                  templateUrl: '/tpl/admin_tpl/signin.html',
	                  resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad ){
	                          return uiLoad.load( ['/js/controllers/signin.js'] );
	                      }]
	                  }
	             })
	             .state('access.signup', {
	            	 url: '/signup',
	                  templateUrl: '/tpl/admin_tpl/signup.html',
	                  resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad ){
	                          return uiLoad.load( ['/js/controllers/signup.js'] );
	                      }]
	                  }
	             })
				.state('access.404', {
	                  url: '/404',
	                  templateUrl: '/tpl/admin_tpl/404.html'
	             })
				
		}
	);