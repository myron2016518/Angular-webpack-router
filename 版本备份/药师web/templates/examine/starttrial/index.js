module.exports = angular.module("app.starttrial")
    .controller("starttrialCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', 'ngDialog', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl,ngDialog) {
	
		
		$scope.doctorId = $rootScope.userInfo.data.userInfo.customerId;
		
		
		$scope.starttrialAction = function(){
			var data = {
                'doctorId': $scope.doctorId,
                'doctorName': $rootScope.userInfo.data.userInfo.name,
                'hospitalId': '',
                'hospitalName': ''
            }
        	httpService.linkHttp(apiUrl.queryExamineStarttrial,data).then(function(res) {
                    // 判断请求成功
                    var data = res.data;
                   if(data.errCode == "000002") {
					}else if (data.errCode == "000000") {
                        //var data = data.data;
                         console.log(data);
                        $state.go('examine.triallohandle');
                    }else{
                    	ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请求出现异常，请稍后再试。</p></div>',
			                className: 'ngdialog-theme-default',
			                showClose: false,
			                closeByDocument: false,
			                closeByEscape: false,
			                plain: true,
			            });
                        $timeout(function(){
			            	ngDialog.close();
			            },'2000');
                    }
                    
            });
                   
			//$state.go('examine.triallohandle');
		}
		
		
		//初始化
		$scope.getDoctorInfo = function() {
			//http://192.168.1.249:8207//web/inner/v1/prescription/audit/doctorInfoQuery?customerId=217979635127
			var data = {
				'customerId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.doctorInfoQuery, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					//判断是否已有再审单
					if(data.data.orderNo == "0"){
						if(data.data.authenticationStatus != "3" ) {
							$state.go('examine');
						}
					}else{
						
			            var _getOrderNo = data.data.orderNo;
			            
			            ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >您目前有未审核完毕的单，即将转入审核页面。</p></div>',
			                className: 'ngdialog-theme-default',
			                showClose: false,
			                closeByDocument: false,
			                closeByEscape: false,
			                plain: true,
			            });
                        $timeout(function(){
			            	ngDialog.close();
			            	$state.go('examine.prescriptionaudit',{'orderNo':_getOrderNo});
			            },'2000');
			           /* var dataStarttrial = {
			                'doctorId': $scope.doctorId,
			                'doctorName': $rootScope.userInfo.data.userInfo.name,
			                'hospitalId': '',
			                'hospitalName': ''
			            }
			        	httpService.linkHttp(apiUrl.queryExamineStarttrial,dataStarttrial).then(function(resStarttrial) {
			                    // 判断请求成功
			                    var datas = resStarttrial.data;
			                   
			                    if (datas.errCode == "000000") {
			                    	ngDialog.open({
						                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >您目前有未审核完毕的单，即将转入审核页面。</p></div>',
						                className: 'ngdialog-theme-default',
						                showClose: false,
						                closeByDocument: false,
						                closeByEscape: false,
						                plain: true,
						            });
			                        $timeout(function(){
						            	ngDialog.close();
						            	$state.go('examine.prescriptionaudit',{'orderNo':_getOrderNo});
						            },'2000');
			                    }
			                    
			            });*/
			            
			            
					}
				}else{
					//$state.go('login');
				}
			});
		}
		
		
		
    }]).name
