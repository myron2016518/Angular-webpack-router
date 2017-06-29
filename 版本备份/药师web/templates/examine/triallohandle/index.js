module.exports = angular.module("app.triallohandle")
    .controller("triallohandleCtrl", ['$scope', '$state', '$http','httpService', '$stateParams', '$timeout', '$interval','$rootScope', 'apiUrl', 'ngDialog', function($scope, $state, $http, httpService, $stateParams, $timeout, $interval,$rootScope,apiUrl,ngDialog) {
		
	
		console.log('这是triallohandle:  ')
		$scope.orderNo = '';
		$scope.haveOrderNo = false;
		$scope.refreshTrial = function(){
			$scope.getTrial();
		}
		/*$scope.stopTrial = function(){
			var data = {
                    'doctorId': $rootScope.userInfo.data.userInfo.customerId
            }
        	httpService.linkHttp(apiUrl.stopAudit,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$state.go('examine.starttrial');
                }
                
            });
			
		}*/
		/*$scope.goprescriptionaudit = function(){
			console.log($scope.orderNo);
			ngDialog.close();
			$state.go('examine.prescriptionaudit',{'orderNo':$scope.orderNo});
		}*/
		
		$scope.initTriall = function() {
			
			var data = {
            	'doctorId': $rootScope.userInfo.data.userInfo.customerId,
            	'type': 0
            }
        	httpService.linkHttp(apiUrl.pauseAudit,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	
                	if(rsdata.data.status == 2 || rsdata.data.status == 1){
                		$rootScope.suspensionText = '暂停接单'
                	}
                	else if(rsdata.data.status == 3){
                		$rootScope.suspensionText = '继续接单'
                	}
                }
           });
           
           
			var time = $interval(function() {
				if($state.current.url != '/triallohandle'){
					$interval.cancel(time);
					return;
				} 
				if($scope.haveOrderNo) {
					
					$interval.cancel(time);
				}else{
					
					$scope.initTriallHttp();
				}
			}, 8000);
			
			
		}
		
		$scope.initTriallHttp = function() {
			var initdata = {
                    'doctorId': $rootScope.userInfo.data.userInfo.customerId,
                    'doctorName': $rootScope.userInfo.data.userInfo.name
            }
			$http({
                method: apiUrl.queryTriallohandle.method,
                url: apiUrl.queryTriallohandle.url,
                params: initdata,
                data: initdata
            }).then(function(res){
            	var rsdata = res.data;
                console.log(rsdata);
                ngDialog.close();
                if (rsdata.errCode == "000000") {
                	//if(rsdata.data.inPool == 'true' ){
	                	 if(rsdata.data.prescriptionList.length <=0 ) return;
	                     $scope.haveOrderNo = true;
	                    $scope.orderNo = rsdata.data.prescriptionList[0].orderNo;
		                ngDialog.openConfirm({
		                    template: 'firstDialogId',
		                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
		                    controller: 'triallohandleCtrl',
		                    showClose: false,
		                    closeByDocument: false,
	                    	closeByEscape: false
		                }).then(function (value) {
		                    console.log($scope.orderNo);
							ngDialog.close();
							$state.go('examine.prescriptionaudit',{'orderNo':$scope.orderNo});
		                }, function (reason) {
		                    console.log('Modal promise rejected. Reason: ', reason);
		                    $scope.stopTrial();
		                });
/*		            }else{
                		ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请重新进入候诊室。</p></div>',
			                className: 'ngdialog-theme-default',
			                showClose: false,
			                closeByDocument: false,
			                plain: true,
			            });
			            $timeout(function(){
			            	ngDialog.close();
			            	$state.go('examine.starttrial');
			            },'2000');
                	}  */
	                
                }
                
            	
            	 
            },function(data,header,config,status){ //处理响应失败
                
                 $scope.haveOrderNo = false;
                
            })
			
		}
		
		
		//获取数据
		$scope.getTrial = function(){
			var data = {
                    'doctorId': $rootScope.userInfo.data.userInfo.customerId,
                    'doctorName': $rootScope.userInfo.data.userInfo.name
            }
        	httpService.linkHttp(apiUrl.queryTriallohandle,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                ngDialog.close();
                if (rsdata.errCode == "000000") {
                	//是否在审方池
                	//if(rsdata.data.inPool == 'true' ){
                		if(rsdata.data.prescriptionList.length <=0 ) return;
	                    $scope.haveOrderNo = true;
	                    $scope.orderNo = rsdata.data.prescriptionList[0].orderNo;
		                ngDialog.openConfirm({
		                    template: 'firstDialogId',
		                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
		                    controller: 'triallohandleCtrl',
		                    showClose: false,
		                    closeByDocument: false,
	                    	closeByEscape: false
		                }).then(function (value) {
		                    console.log($scope.orderNo);
							ngDialog.close();
							$state.go('examine.prescriptionaudit',{'orderNo':$scope.orderNo});
		                }, function (reason) {
		                    console.log('Modal promise rejected. Reason: ', reason);
		                    $scope.stopTrial();
		                });
               		/*}else{
                		ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请重新进入候诊室。</p></div>',
			                className: 'ngdialog-theme-default',
			                showClose: false,
			                closeByDocument: false,
			                plain: true,
			            });
			            $timeout(function(){
			            	ngDialog.close();
			            	$state.go('examine.starttrial');
			            },'2000');
                	}*/
                    
                }
                
            },function(data,header,config,status){ //处理响应失败
               	$scope.haveOrderNo = true;
                
            });
		}
		
    }]).name
