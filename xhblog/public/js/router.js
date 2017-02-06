app.run(
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}
	)
	.config(
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise('/app/dashboard');
			$stateProvider
				.state('app', {
					abstract: true,
					url: '/app',
					templateUrl: '/tpl/admin_tpl/blocks/app.html',
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
					url: '/article',
					templateUrl: '/tpl/admin_tpl/article/article.html',
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
					url: '/list',
					templateUrl: '/tpl/admin_tpl/article/list.html',
					
				})
				.state('app.article.search', {
					url: '/search',
					templateUrl: '/tpl/admin_tpl/article/search.html',
					
				})
				.state('app.setting', {
					url: '/setting',
					templateUrl: '/tpl/admin_tpl/setting/setting.html',
					resolve: {
	                      deps: ['uiLoad',
	                        function( uiLoad){
	                          return uiLoad.load([
	                                '/js/services/setting.client.services.js',
	                                '/js/controllers/setting.client.controllers.js'
	                          ]);
	                      }]
		                }
					
				})
				.state('app.setting.banner', {
					url: '/banner',
					templateUrl: '/tpl/admin_tpl/setting/banner.html',
					
				})
				
				
				
		}
	);