'use strict';
/*main Controllers */
angular.module('app').controller('AppCtrl', 
	['$rootScope', '$scope', '$localStorage', '$window', '$http', '$state', '$uibModal', 'SETTINGS',
		function($rootScope, $scope, $localStorage, $window, $http, $state, $uibModal, SETTINGS) {
			//向后台请求主页面要展示的数据（文章总数，未读留言）
			$http({ 
				method: "GET",
				url: "/admin/loadData"
			}).then(function(res) {
				console.log(res);
				$rootScope.articleTotal = res.data.articleTotal;
				$rootScope.lm = res.data.lmdoc;
				$rootScope.manager = res.data.manager;
				$rootScope.categorys = res.data.categorys;
				$rootScope.tags = res.data.tags;
			}).catch(function(err) {

			})

			//退出登录
			$scope.logout = function() {
				$http({
					method: "POST",
					url: "/admin/logout"
				}).then(function(res) {
					if(res.data.code == 1) {
						$state.go("access.signin");
					}
				}, function(err) {

				})
			}

			//留言回复
			$scope.reply = function(item) {
				$uibModal.open({
					templateUrl: '/admin/tpl/modal/wordModal.html',
					size: 'md',
					controller: 'WordModalInstanceCtrl',
					resolve: {
						wordItem: function() {
							return item;
						}
					}
				}).result.then(function(data) {
					if(data.code == 1) {
						//http://blog.csdn.net/u013415189/article/details/51451431
						console.log(x);
					}
				}).catch(function() {
					console.log(2);
				})
			}
			
			
			//网站布局颜色设置
			$scope.app = SETTINGS;

			// save settings to local storage
			if(angular.isDefined($localStorage.settings)) {
				$scope.app.settings = $localStorage.settings;
			} else {
				$localStorage.settings = $scope.app.settings;
			}
			$scope.$watch('app.settings', function() {
				if($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
					// aside dock and fixed must set the header fixed.
					$scope.app.settings.headerFixed = true;
				}
				// save to local storage
				$localStorage.settings = $scope.app.settings;
			}, true);

		}
	]);