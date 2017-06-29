module.exports = angular.module("app.todayHistoryDetails")
	.controller("historyDetailsCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$rootScope','apiUrl','$timeout',
		function($scope, $state, httpService, $stateParams, $rootScope,apiUrl,$timeout) {
			$scope.is = $stateParams.is
			
			var data = {
				orderNo: $stateParams.id,
			}

			$scope.record = [{
				type: 1,
				text: '医生,在？'
			}, {
				type: 2,
				text: '在！'
			}, {
				type: 1,
				text: '最近身体不舒服，老是发高烧。'
			}, {
				type: 1,
				text: '特别特别严重，感觉快死了'
			}, {
				type: 2,
				text: '那你还不快去死！'
			}, {
				type: 2,
				text: '再逼逼劳资打死你'
			}, {
				type: 1,
				text: '劳资就逼逼了，来打我呀！'
			}, {
				type: 1,
				text: '不打死我算你输'
			}, {
				type: 2,
				text: '日你妈卖批的，劳资今劳资今天死你'
			}]
			httpService.linkHttp(apiUrl.detail, data).then(function(res) {
				$scope.data = res.data.data
				console.log($scope.data)
			})
		}
	]).name