module.exports = angular.module("app.prescriptionaudit")
	.controller("prescriptionauditCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout', '$rootScope', 'apiUrl', '$interval', 'ngDialog', 'Md5', function($scope, $state, httpService, $stateParams, $timeout, $rootScope, apiUrl, $interval, ngDialog, Md5) {
		
		$scope.isnotpass = false;
		$scope.ispass = false;
		$scope.inputPwdShow = false;
		$scope.showTxtOrPDF = false;
		var reg = /^[0-9]*$/;
		$scope.orderNo = $state.params.orderNo || '';
		$scope.doctorId = $rootScope.userInfo.data.userInfo.customerId;
		$scope.doctorName =  $rootScope.userInfo.data.userInfo.name;
		
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
			"updateDate": "" ,
			"hospitalName": "" ,
			"overTime": "" ,
			"restSecond": "" 
		};
		$scope.dateTime = 180;
		$scope.submitProText = '';
		$scope.PWDandPro = true;
		$scope.isSubmit = true;
		//$rootScope.PassStatus = '初始值';
		
		//倒计时三分钟监听
		$scope.$watch('dateTime',function(newValue,oldValue, scope){
		        if($scope.dateTime == 0){
		        	if($rootScope.stopTime) return;
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
			$scope.ispass = false;
		}
		//通过
		$scope.passAction = function() {
			$scope.isnotpass = false;
			$scope.ispass = true;
			$scope.getPossAndNotPass({'status':1});
		}
		//不通过提交
		$scope.notpassSubmit = function() {
			$scope.getPossAndNotPass({'status':0});
		}
		

		//获取加签页面数据
		$scope.getPDetail = function() {
			
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
					//if(data.data.inPool){
						/*if(data.data.overTime == "1") {
							ngDialog.open({
			                    template: 'timeoutPrompt',
			                    controller: 'prescriptionauditCtrl',
			                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
			                    showClose: false,
			                    closeByEscape: false,
			                    closeByDocument: false
			                });
			                $timeout(function(){
			                	ngDialog.close();
			                	$state.go('examine.starttrial');
			                },'2000');
						}else{*/
							if(data.data.PDFUrl == ''){
								$scope.showTxtOrPDF = true;
								
							}else{
								// $scope.PDFurl = 'http://192.168.1.240/prescriptionFile/20170303/1/1_1488592962526.pdf'
								 $scope.PDFurl = data.data.PDFUrl
								$scope.$watch('PDFurl',function(newVal){
									console.log(newVal)
									$timeout(function(){
									document.getElementById("pdf").src= $scope.PDFurl!=null&&$scope.PDFurl?$scope.PDFurl:'';
								},100)
								})
								
							}
							$scope.prescriptionDetail = data.data;
							$scope.dateTime = data.data.restSecond;
						//}
						var time = $interval(function() {
		
							$scope.dateTime--;
							if($scope.dateTime == 0) {
								$interval.cancel(time);
							}
		
						}, 1000);
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
					
				}else if(data.errCode == "32000901"){	//超时未审核
					ngDialog.open({
	                    template: 'timeoutPrompt',
	                    controller: 'prescriptionauditCtrl',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    showClose: false,
	                    closeByEscape: false,
	                    closeByDocument: false
	                });
	                $timeout(function(){
	                	ngDialog.close();
	                	$state.go('examine.starttrial');
	                },'2000');
				
				}else if(data.errCode == "32001002"){	//处方已关闭
	                ngDialog.open({
		                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >处方已关闭。</p></div>',
		                className: 'ngdialog-theme-default',
		                showClose: false,
		                closeByDocument: false,
		                closeByEscape: false,
		                plain: true,
		            });
	                $timeout(function(){
	                	ngDialog.close();
	                	$state.go('examine.triallohandle');
	                },'2000');
					
				}else{
					ngDialog.open({
	                    template: 'PDetailError',
	                    controller: 'prescriptionauditCtrl',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    showClose: false,
	                    closeByEscape: false,
	                    closeByDocument: false
	                });
	                $timeout(function(){
	                	ngDialog.close();
	                	//$state.go('examine.starttrial');
	                },'2000');
				}
				
				

			});
		}

		//通过与不通过触发事件
		$scope.getPossAndNotPass = function(indata) {
			//   status:0：不通过，1：通过     .  reason: 不通过原因  status为0时传
			if($scope.dateTime == 0){
				ngDialog.open({
	                    template: 'timeoutPrompt',
	                    controller: 'prescriptionauditCtrl',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    showClose: false,
	                    closeByEscape: false,
	                    closeByDocument: false
	                });
	                $timeout(function(){
	                	ngDialog.close();
	                	$state.go('examine.starttrial');
	                },'2000');
			} else{
				if(indata.status == 0) {
					var status = !(/\S/.test($scope.notpass.Describe));
	//				if(status) return;
					if(status){
						ngDialog.open({
			                template: 'notPassReason',
			                controller: 'prescriptionauditCtrl',
			                className: 'ngdialog-theme-plain ngdialog-Triallohandle',
			                showClose: false,
			                closeByEscape: false,
			                closeByDocument: false
			            });
			            $timeout(function(){
			            	ngDialog.close();
			            },'2000');
			            
						return;
					}else{
						var _opt = {
	                		'PassStatus':0,
	                		'notpassDescribe':$scope.notpass.Describe
	                	}
	                	$scope.httpAudit(_opt);
					}
					
				}else{
					
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
		          	
		          	$timeout(function(){
						document.getElementById("mypassword").focus();
					},1000)
				}
			}
			
			
			
		}
		//输入加签密码验证和提交审单
		$scope.inputChange = function(){
			var _isnumber = reg.test($scope.form.inputpassword)
			if(!_isnumber) return;
			
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
	                if(rsdata.errCode == "000002") {
					}else if (rsdata.errCode == "000000") {
	                	$scope.PWDandPro = false;
	                	$scope.submitProText = '审核处理中...';
						$scope.isSubmit = false;
	                	var _opt = {
	                		'PassStatus':1,
	                		'notpassDescribe':''
	                	}
	                	$scope.httpAudit(_opt);
	                }else{
	                	$scope.inputPwdShow = true;
	                }
	           });
			}
			
		}
		
		
		$scope.httpAudit = function(opt) {
				$rootScope.stopTime = true;
            	//加签密码请求结果为成功后，加签请求
            	var notPD = opt.notpassDescribe || '';
            	var dataAudit = {
					'doctorId': $scope.doctorId,
					'orderNo': $scope.orderNo,
					'status': opt.PassStatus,
					'reason': notPD,
					'doctorName': $scope.doctorName
				}
	
				httpService.linkHttp(apiUrl.queryPrescriptionAudit, dataAudit).then(function(resAudit) {
					// 判断请求成功
					
					var dataPA = resAudit.data;
					console.log(dataPA);
					
					if(dataPA.errCode == "000002") {
					}else if(dataPA.errCode == "32001001") { //处方审核超时
							ngDialog.close();
							ngDialog.open({
			                    template: 'timeoutPrompt',
			                    controller: 'prescriptionauditCtrl',
			                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
			                    showClose: false,
			                    closeByEscape: false,
			                    closeByDocument: false
			                });
			                $timeout(function(){
			                	ngDialog.close();
			                	$state.go('examine.starttrial');
			                },'2000');
			              
			                
					}else{
						if(opt.PassStatus == 0){
								ngDialog.open({
					                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >操作成功！</p></div>',
					                className: 'ngdialog-theme-default',
					                showClose: false,
					                closeByDocument: false,
					                closeByEscape: false,
					                plain: true,
					            });
					            
							}else{
								$scope.submitProText = '操作成功！';
							}
							
							$timeout(function(){
			                	ngDialog.close();
			                	//判断是否点击停止审方
			                	if($rootScope.isStopOrder){
			                		$state.go('examine.starttrial');
			                	}else{
			                		$state.go('examine.triallohandle');
			                	}
			                	
			                },'2000');
					}
					/* else{
						//不成功
						if(opt.PassStatus == 0){
							ngDialog.open({
				                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >操作失败，请重试。</p></div>',
				                className: 'ngdialog-theme-default',
				                showClose: false,
				                closeByDocument: false,
				                closeByEscape: false,
				                plain: true,
				            });
				            $timeout(function(){
			                	ngDialog.close();
			                },'2000');
						}else{
							$scope.submitProText = '操作失败，请重试。';
							$scope.isSubmit = true;
						}
					}*/
					
					
				});
            
		}

	}]).name