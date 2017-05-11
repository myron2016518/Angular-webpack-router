module.exports = angular.module("app.starttrial")
    .controller("starttrialCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl) {
	
		
		$scope.doctorId = $rootScope.userInfo.data.customerId;
		
		
		$scope.starttrialAction = function(){
			var data = {
                    'doctorId': $scope.doctorId
                }
            	httpService.linkHttp(apiUrl.startInquiry,data).then(function(res) {
                        // 判断请求成功
                        var data = res.data;
                       
                        if (data.errCode == "000000") {
                            //var data = data.data;
                             console.log(data);
                            $state.go('examine.triallohandle');
                        }
                        
                    });
                   
			$state.go('examine.triallohandle');
		}
		
		
		//初始化
		$scope.getDoctorInfo = function() {
			//http://192.168.1.249:8207//web/inner/v1/prescription/audit/doctorInfoQuery?customerId=217979635127
			var data = {
				'doctorId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.doctorDetail, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					if(data.data.authenticationStatus != "3" ) {
						$state.go('examine');
					}
				}else{
					//$state.go('login');
				}
			});
		}
		
		
		
    }]).name
