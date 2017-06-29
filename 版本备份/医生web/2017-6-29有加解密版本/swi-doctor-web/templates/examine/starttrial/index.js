module.exports = angular.module("app.starttrial")
    .controller("starttrialCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl) {
	
		
		$scope.doctorId = $rootScope.userInfo.data.customerId;
		console.log($rootScope.userInfo.data.laseLoginTime);
		console.log($rootScope.userInfo);
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
					//判断是否已有再审单
					if(data.data.orderNo == ""){
						if(data.data.authenticationStatus != "3" ) {
							$state.go('examine');
						}
					}else{
						
			            var _getOrderNo = data.data.orderNo;
			            ngDialog.close();
			            ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >您目前有未接诊完毕的单，即将转入接诊页面。</p></div>',
			                className: 'ngdialog-theme-default',
			                showClose: false,
			                closeByDocument: false,
			                closeByEscape: false,
			                plain: true,
			            });
                        $timeout(function(){
			            	ngDialog.close();
			            	 //  1：问诊 2处方打回
			            	if(data.data.inquiryType == '1'){
			            		$state.go('examine.prescriptionaudit',{'orderNo':_getOrderNo});
			            	}else{
			            		$state.go('examine.prescriptionauditVideo',{'orderNo':_getOrderNo});
			            	}
			            	
			            },'2000');
			           
			            
			            
					}
					
				}else{
					//$state.go('login');
				}
			});
		}
		
		
		
    }]).name
