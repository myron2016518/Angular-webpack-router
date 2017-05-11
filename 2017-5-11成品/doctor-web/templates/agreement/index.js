module.exports = angular.module("app.agreement")
    .controller("agreementCtrl", ['$scope', '$state', 'httpService', '$timeout', '$rootScope', 'apiUrl', 'Md5', 'ngDialog', function($scope, $state, httpService, $timeout, $rootScope, apiUrl, Md5, ngDialog) {

      	$scope.httpTitle = '';
		$scope.httpText = '';
        $scope.initAgreement = function() {
        	
			var data = {}
			httpService.linkHttp(apiUrl.getAgreementInfo, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					
					$scope.httpTitle = data.data.agreementName;
					$scope.httpText = data.data.agreementContent;
				}else{
					//$state.go('login');
				}
			});
		
        }



    }]).name