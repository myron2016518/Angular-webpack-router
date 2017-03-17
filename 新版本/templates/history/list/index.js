module.exports = angular.module("app.history")
	.controller("historyCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$rootScope', 'apiUrl',
		function($scope, $state, httpService, $stateParams, $rootScope, apiUrl) {

			var data = {
				doctorId: '217979635127',
				pageSize: 10,
				pageNum: 1
			}

			$scope.conf = {
				total: 1,
				currentPage: 1,
				itemPageLimit: 1,
				// 是否显示一页选择多少条
				isSelectPage: true,
				// 是否显示快速跳转
				isLinkPage: false
			}


			$scope.$watch('conf.currentPage + conf.itemPageLimit', function(news) {
				data.pageNum = $scope.conf.currentPage
				// 把你的http请求放到这里
				httpService.linkHttp(apiUrl.historyList, data).then(function(res) {
					$scope.list = res.data.data
					$scope.conf.total = $scope.list.totalPage;
					console.log($scope.list)
				})

			})


		}
	]).name