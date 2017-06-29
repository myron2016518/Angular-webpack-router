module.exports = angular.module("app.historyDetails")
	.controller("historyDetailsCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$rootScope','apiUrl',
		function($scope, $state, httpService, $stateParams, $rootScope,apiUrl) {
			console.log($scope.url)
			$scope.is = $stateParams.is
			
			var data = {
				orderNo: $stateParams.id,
				doctorName:'217979635127'
			}

			httpService.linkHttp(apiUrl.detail, data).then(function(res) {
				$scope.data = res.data.data
				console.log($scope.data)

			})

		}
	]).name