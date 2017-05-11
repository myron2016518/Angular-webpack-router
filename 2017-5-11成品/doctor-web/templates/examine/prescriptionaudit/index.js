module.exports = angular.module("app.prescriptionaudit")
	.controller("prescriptionauditCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout', '$rootScope', 'apiUrl', '$interval', 'ngDialog', 'Md5', function($scope, $state, httpService, $stateParams, $timeout, $rootScope, apiUrl, $interval, ngDialog, Md5) {
		
		
		$scope.countDownTime =  $rootScope.timeCount || 0;
		$scope.orderNo = $state.params.orderNo || '';
		$scope.doctorId = $rootScope.userInfo.data.customerId;
		$scope.doctorName =  $rootScope.userInfo.data.name;
		$scope.isSaveUserInfo = false;
		$scope.isSaveUserPhone = false;
		$scope.form = {
            'username': '',
            'sex': '',
            'age': '',
            'phone': '',
            'chiefComplaint': '',
            'pastHistory': '',
            'preliminaryDiagnosis': '',
            'doctorAdvice': '',
            'patientId':''
        }
		
		//计时器
		$interval(function() {
			$scope.countDownTime = $scope.countDownTime +1000;
			$rootScope.timeCount = $scope.countDownTime;
		},1000);
		//点击修改和保存
		$scope.updataUserInfo = function() {
			$scope.isSaveUserInfo = true;
		}
		$scope.updataUserPhone = function() {
			$scope.isSaveUserPhone = true;
		}
		$scope.saveUserInfo = function() {
			$scope.isSaveUserInfo = false;
		}
		$scope.saveUserPhone = function() {
			$scope.isSaveUserPhone = false;
		}
		
		
		//暂停接单
		$scope.pauseInquiry = function(){
			var data = {
                    'doctorId': $rootScope.userInfo.data.customerId
            }
        	httpService.linkHttp(apiUrl.pauseInquiry,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	//$scope.stopJiedan = true;
                }
                
            });
			
		}
		//结束问诊,保存病历，完成诊断并开处方
		$scope.pauseOver = function(){
			
			var data = {
                    'doctorId': $rootScope.userInfo.data.customerId,
                    'patientId':$scope.form.patientId,
                    'prescriptionFlag':'',
                    'chiefComplaint':$scope.form.chiefComplaint,
                    'doctorAdvice':$scope.form.doctorAdvice,
                    'pastHistory':$scope.form.pastHistory,
                    'preliminaryDiagnosis':$scope.form.preliminaryDiagnosis
                    
            }
        	httpService.linkHttp(apiUrl.over,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	//$scope.stopJiedan = true;
                }
                
            });
			
		}
		
		
		//保存病历和开处方
		$scope.saveMedicalRecord = function(staut) {
			if($scope.form.chiefComplaint == '' || $scope.form.preliminaryDiagnosis == ''){
				ngDialog.open({
	                template: 'chiefComplaintText',
	                controller: 'prescriptionauditCtrl',
	                className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                showClose: false,
	                closeByEscape: false,
	                closeByDocument: false
	            });
	            $timeout(function(){
	            	ngDialog.close();
	            },'2000');
			}else{
				var data = {
					'orderNo': $scope.orderNo,
					'chiefComplaint': $scope.form.chiefComplaint,
					'pastHistory': $scope.form.pastHistory,
					'preliminaryDiagnosis': $scope.form.preliminaryDiagnosis,
					'doctorAdvice': $scope.form.doctorAdvice
				}
				httpService.linkHttp(apiUrl.caseEdit, data).then(function(res) {
					// 判断请求成功
					var data = res.data;
					console.log(res);
					if(data.errCode == "000000") {
						
					}else{
						//$state.go('login');
					}
				});
				if(staut != 0){
					ngDialog.close();
					$state.go('examine.prescribe',{'orderNo':$scope.orderNo});
				}
			}
			
		}
		
	
		//获取加签页面数据
		$scope.getPDetail = function() {
			
			var _account = $rootScope.userInfo.data.imNo;
			var _pwd = $rootScope.userInfo.data.imToken;
			
			var data = {
				'orderNo': $scope.orderNo
			}
			httpService.linkHttp(apiUrl.queryCaseDetail, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(data);
				if(data.errCode == "000000") {
					$scope.form.username = data.data.patientName;
					$scope.form.age = data.data.age;
					$scope.form.sex = data.data.sex == '0'?'女':'男';;
					$scope.form.phone = data.data.patientMobileNo;
					$scope.form.chiefComplaint = data.data.chiefComplaint;
					$scope.form.doctorAdvice = data.data.doctorAdvice;
					$scope.form.pastHistory = data.data.pastHistory;
					$scope.form.preliminaryDiagnosis = data.data.preliminaryDiagnosis;
					$scope.form.deptName = data.data.deptName;
					$scope.form.patientId = data.data.patientId;
					
					//var _huanzheID = data.data.imId;
					var _huanzheID = 'xpc11';
					var _openType = 0;
					
					$timeout(function(){
						document.getElementById("pdf").src= './NIM_Web/im/index.html?account='+_account+'&pwd='+_pwd+'&huanzheID='+_huanzheID+'&orderNo='+$scope.orderNo+'&patientName='+$scope.form.username+'&opentype='+_openType;
					},100)
					
					
				}else{
					
				}
			});
			
	        
	        
		}


	}]).name