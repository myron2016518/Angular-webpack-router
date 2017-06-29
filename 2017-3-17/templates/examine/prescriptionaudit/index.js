module.exports = angular.module("app.prescriptionaudit")
	.controller("prescriptionauditCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout', '$rootScope', 'apiUrl', '$interval', 'ngDialog', 'Md5', function($scope, $state, httpService, $stateParams, $timeout, $rootScope, apiUrl, $interval, ngDialog, Md5) {
		
		$scope.isnotpass = false;
		$scope.inputPwdShow = false;
		$scope.orderNo = $state.params.orderNo || '';
		$scope.doctorId = '217979635127';
		$scope.doctorName =  '林少康';
		$scope.notpass = {
			'Describe': ''
		};
		$scope.form = {
                'inputpassword': ''
        }
		
		$scope.prescriptionDetail = {
			"age": null, 
			"auditDoctorSign": "", 
			"auditHistoryList": [
				{ "aduitStatus": "", 
				"doctorId": "", 
				"doctorName": "", 
				"id": null, 
				"orderNo": "", 
				"reason": "", 
				"updateDate": null 
				}
			],
			"createDate": null,
			"deptName": "",
			"diagDoctorSign": "", 
			"doctorAdvice": "", 
			"doctorId": "", 
			"doctorName": "", 
			"drugList": [
			{ "createDate": null, "doctorDefinedFlag": "", "drugId": "", "drugName": "", "frequency": "", "id": null, "number": "", "orderNo": "", "serialNo": null, "specifications": "", "unitDose": "", "usage": "" }
			],
			"patientId": "", 
			"patientName": "", 
			"preliminaryDiagnosis": "", 
			"sex": "", 
			"updateDate": "" 
		};
		$scope.dateTime = 180;
		$scope.submitProText = '';
		$scope.PWDandPro = true;
		$scope.isSubmit = true;
		//$rootScope.PassStatus = '初始值';
		console.log('这是prescriptionaudit:  ' + $state)
		console.log($scope.orderNo)
		
		//倒计时三分钟监听
		$scope.$watch('dateTime',function(newValue,oldValue, scope){
		        if($scope.dateTime == 0){
		        	 ngDialog.open({
	                    template: 'timeoutPrompt',
	                    controller: 'prescriptionauditCtrl',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    showClose: false,
	                    closeByDocument: false
	                });
	                $timeout(function(){
	                	ngDialog.close();
	                	$state.go('examine.starttrial');
	                },'2000');
		        } 
		})

		//不通过
		$scope.noPassAction = function() {
			$scope.isnotpass = true;
		}
		//通过
		$scope.passAction = function() {
			$scope.getPossAndNotPass({'status':1});
		}
		//不通过提交
		$scope.notpassSubmit = function() {
			$scope.getPossAndNotPass({'status':0});
		}
		$scope.stopTrial = function() {
			var data = {
                    'doctorId': '217979635127'
            }
        	httpService.linkHttp(apiUrl.stopAudit,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$state.go('examine.starttrial');
                }
                
            });
		}

		//获取加签页面数据
		$scope.getPDetail = function() {
			var data = {
				'orderNo': $scope.orderNo,
				'doctorName': $scope.doctorName,
				'doctorId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.queryPrescriptionDetail, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					
					if(data.data.overTime == "1") {
						ngDialog.open({
		                    template: 'timeoutPrompt',
		                    controller: 'prescriptionauditCtrl',
		                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
		                    showClose: false,
		                    closeByDocument: false
		                });
		                $timeout(function(){
		                	ngDialog.close();
		                	$state.go('examine.starttrial');
		                },'2000');
					}else{
						$scope.prescriptionDetail = data.data;
					}
	
					var time = $interval(function() {
	
						$scope.dateTime--;
						if($scope.dateTime == 0) {
							$interval.cancel(time);
						}
	
					}, 1000);
				}else{
					ngDialog.open({
	                    template: 'timeoutPrompt',
	                    controller: 'prescriptionauditCtrl',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    showClose: false,
	                    closeByDocument: false
	                });
	                $timeout(function(){
	                	ngDialog.close();
	                	$state.go('examine.starttrial');
	                },'2000');
				}
				
				

			});
		}

		//通过与不通过触发事件
		$scope.getPossAndNotPass = function(indata) {
			//   status:0：不通过，1：通过     .  reason: 不通过原因  status为0时传
			if($scope.dateTime == 0) return;

			if(indata.status == 0) {
				var status = !(/\S/.test($scope.notpass.Describe));
				if(status) return;
				$rootScope.notpassDescribe = $scope.notpass.Describe;
			}
			$rootScope.PassStatus = indata.status;
			//加签密码弹窗：
			ngDialog.openConfirm({
                template: 'inputPWDDialogId',
                className: 'ngdialog-theme-plain ngdialog-inputPWD',
                controller: 'prescriptionauditCtrl',
                showClose: false,
                closeByDocument: false
            }).then(function (value) {
                console.log($scope.orderNo);
				ngDialog.close();
            }, function (reason) {
              console.log('Modal promise rejected. Reason: ', reason);
          });
		}
		//输入加签密码验证和提交审单
		$scope.inputChange = function(){
			console.log($rootScope.PassStatus);
			if($scope.form.inputpassword.length == 6){
				
				//此处有一个加签密码验证请求，验证成功执行以下
				var data = {
                    'customerId': $scope.doctorId,
                    'password': Md5.hex_md5($scope.form.inputpassword)
	            }
	        	httpService.linkHttp(apiUrl.validateSignPassword,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	//加签密码请求结果为成功后，加签请求
	                	var notPD = $rootScope.notpassDescribe || '';
	                	var dataAudit = {
							'doctorId': $scope.doctorId,
							'orderNo': $scope.orderNo,
							'status': $rootScope.PassStatus,
							'reason': notPD,
							'doctorName': $scope.doctorName
						}
			
						httpService.linkHttp(apiUrl.queryPrescriptionAudit, dataAudit).then(function(resAudit) {
							// 判断请求成功
							$scope.PWDandPro = false;
							var dataPA = resAudit.data;
							console.log(dataPA);
							//成功
							if(dataPA.errCode == "000000") {
								$scope.submitProText = '操作成功！';
								$scope.isSubmit = false;
								$timeout(function(){
				                	ngDialog.close();
				                	$state.go('examine.starttrial');
				                },'2000');
							}else{
								//不成功
				                $scope.submitProText = '操作失败，请重试。';
								$scope.isSubmit = true;
							}
						});
	                }else{
	                	$scope.inputPwdShow = true;
	                }
	           });
			}
			
		}

	}]).name