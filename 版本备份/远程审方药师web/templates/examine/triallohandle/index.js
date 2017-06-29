module.exports = angular.module("app.triallohandle")
    .controller("triallohandleCtrl", ['$scope', '$state', '$http','httpService', '$stateParams', '$timeout', '$interval','$rootScope', 'apiUrl', 'ngDialog', function($scope, $state, $http, httpService, $stateParams, $timeout, $interval,$rootScope,apiUrl,ngDialog) {
		
	
		console.log('这是triallohandle:  ')
		$scope.orderNo = '';
		$scope.haveOrderNo = false;
		$scope.refreshTrial = function(){
			$scope.getTrial(0);
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
			var time = $interval(function() {
				if($state.current.url != '/triallohandle'){
					$interval.cancel(time);
					return;
				} 
				if($scope.haveOrderNo) {
					
					$interval.cancel(time);
				}else{
					
					$scope.getTrial(1);
				}
			}, 8000);
			
			
		}
		
		/*$scope.initTriallHttp = function() {
			var initdata = {
                    'doctorId': $rootScope.userInfo.doctorId
            }
			$http({
                method: apiUrl.list.method,
                url: apiUrl.list.url,
                params: initdata,
                data: initdata
            }).then(function(res){
            	var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	
                	 if(rsdata.data.length <=0 ) return;
                     $scope.haveOrderNo = true;
                    $scope.orderNo = rsdata.data[0].orderNo;
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
                }
                
            	
            	 
            },function(data,header,config,status){ //处理响应失败
                
                 $scope.haveOrderNo = false;
                
            })
			
		}*/
		
		
		//获取数据
		$scope.getTrial = function(opt){
			var _urlOB = opt == 0 ? apiUrl.list :apiUrl.listNoLoad;
			var data = {
                    'doctorId': $rootScope.userInfo.doctorId
            }
        	httpService.linkHttp(_urlOB,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                    if(rsdata.data.length <=0 ) return;
                     $scope.haveOrderNo = true;
                    $scope.orderNo = rsdata.data[0].orderNo;
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
                }
                
            },function(data,header,config,status){ //处理响应失败
               	$scope.haveOrderNo = true;
                
            });
		}
		
    }]).name
