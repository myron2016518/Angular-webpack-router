module.exports = angular.module("app.history")
	.controller("historyCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$rootScope', 'apiUrl',
		function($scope, $state, httpService, $stateParams, $rootScope, apiUrl) {
			console.log(apiUrl.doctorInquirylist)
			var data = {
				doctorId: $rootScope.userInfo.data.customerId,
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
				httpService.linkHttp(apiUrl.doctorInquirylist, data).then(function(res) {
					console.log(res)
					if(res.data.errCode == '000000'){
						$scope.list = res.data.data.list
						console.log($scope.list)
					}
					$scope.conf.total = $scope.list&&res.data.data.totalPage?res.data.data.totalPage:0;

				})

			})


		}
	]).name