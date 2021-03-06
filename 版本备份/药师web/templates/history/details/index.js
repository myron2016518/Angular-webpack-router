module.exports = angular.module("app.historyDetails")
	.controller("historyDetailsCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$rootScope','apiUrl','$timeout',
		function($scope, $state, httpService, $stateParams, $rootScope,apiUrl,$timeout) {
			$scope.is = $stateParams.is
			
			var data = {
				orderNo: $stateParams.id,
				doctorName:$rootScope.userInfo.data.userInfo.name,
				doctorId:$rootScope.userInfo.data.userInfo.customerId,
				type:'1'
			}

			httpService.linkHttp(apiUrl.detail, data).then(function(res) {
				$scope.data = res.data.data
				// $scope.PDFurl = $scope.data&&$scope.data.PDFUrl?$scope.url + $scope.data.PDFUrl:''
				// $scope.PDFurl = 'http://192.168.1.240/prescriptionFile/20170303/1/1_1488592962526.pdf'
				$scope.PDFurl = $scope.data&&$scope.data.PDFUrl?$scope.data.PDFUrl:''
				$timeout(function(){
					document.getElementById("pdf").src= $scope.PDFurl
				},100)
			})
		}
	]).name