module.exports = angular.module("app.user")
    .controller("userCtrl", ['$scope', '$state', 'httpService', '$stateParams','apiUrl','$location',
     function($scope, $state, httpService, $stateParams,apiUrl,$location) {
		console.log('user')

		$location.search('type','number')
		$scope.isHide = 'number'
		$scope.isPage = function(data){
			$location.search('type',data)
			$scope.isHide = $location.search().type
		}
		

		
    }]).name
