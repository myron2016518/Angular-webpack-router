module.exports = angular.module("app.prescriptionaudit")
	.controller("prescriptionauditCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout', '$rootScope', 'apiUrl', '$interval', 'ngDialog', 'Md5', function($scope, $state, httpService, $stateParams, $timeout, $rootScope, apiUrl, $interval, ngDialog, Md5) {
		
		$scope.isnotpass = false;
		$scope.ispass = false;
		$scope.inputPwdShow = false;
		$scope.showTxtOrPDF = false;
		var reg = /^[0-9]*$/;
		/*$rootScope.userInfo = {}
		$rootScope.userInfo.doctorId = '123214';
		$rootScope.userInfo.doctorName = '流域'
		$rootScope.userInfo.mobileNo = '13410708312'*/
		$scope.orderNo = $state.params.orderNo || '';
		$scope.doctorId = $rootScope.userInfo.doctorId;
		$scope.doctorName =  $rootScope.userInfo.doctorName;
		//手机验证码字段
		$scope.userPhone = $rootScope.userInfo.mobileNo;
		$scope.userPhoneShow = $rootScope.userInfo.mobileNo.substring(0,3)+'****'+ $rootScope.userInfo.mobileNo.substring(8,11);
		$scope.userPhoneText = '';
		$scope.userPhoneStatus = false;
		$scope.inputYZMShow = false;
		$scope.YZMTime = 60;
		
		$scope.notpass = {
			'Describe': ''
		};
		$scope.form = {
                'inputpassword': ''
        }
		
		$scope.dateTime = 180;
		//$scope.submitProText = '';
		//$scope.PWDandPro = true;
		//$scope.isSubmit = true;
		//$rootScope.PassStatus = '初始值';
		
		//输入加签密码
		$scope.submitProText = '';
		$scope.PWDandPro = false;
		$scope.isSubmit = true;
		//$scope.yyshuoming = '';
		var reg = /^[0-9]*$/;
		$scope.inputPwdShow = false;
		//手机验证码
		$scope.showChangeYZM = false;
		$scope.userPhoneStatus = false;
		$scope.inputYZMShow = false;
		$scope.YZMTime = 60;
		
		
		
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
			$scope.ispass = false;
		}
		//通过
		$scope.passAction = function() {
			$scope.isnotpass = false;
			$scope.ispass = true;
			$scope.getPossAndNotPass({'status':3});
		}
		//不通过提交
		$scope.notpassSubmit = function() {
			$scope.getPossAndNotPass({'status':4});
		}
		
		//发送校验码
		/*$scope.changeYZMStatus = function() {
			
			var data = {
                    'mobileNo': $scope.userPhone,
                    'clientType': '6'
            }
        	httpService.linkHttp(apiUrl.getVerificationCode,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$scope.userPhoneStatus = true;
					$scope.YZMTime = 60;
					var timeYZMTime = $interval(function() {
						$scope.YZMTime--;
						if($scope.YZMTime == 0) {
							$scope.userPhoneStatus = false;
							$interval.cancel(timeYZMTime);
						}
					}, 1000);
                }
                
            });
		}*/
		$scope.closeYanzhengma = function() {
			
			if($scope.userPhoneText.length == ""){
				$scope.inputYZMShow = true;
			}else{
				//验证短信校验码
				/*var data = {
                    'mobileNo': $scope.userPhone,
                    'smsCode': $scope.userPhoneText
	            }
	        	httpService.linkHttp(apiUrl.verificationCode,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	$scope.inputYZMShow = false;
	                	ngDialog.close();
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
	                }else{
	                	$scope.inputYZMShow = true;
	                }
	                
	            });*/
	           
	           	$scope.jiaqianDialog();
            
			}
		}
		
		/*$scope.stopTrial = function() {
			
			ngDialog.open({
                template: 'timeoutStop',
                controller: 'prescriptionauditCtrl',
                className: 'ngdialog-theme-plain ngdialog-Triallohandle',
                showClose: false,
                closeByDocument: false
            });
            $timeout(function(){
            	ngDialog.close();
            },'2000');
            
            if($rootScope.isStopOrder) return;
			var data = {
                    'doctorId': $scope.doctorId
            }
        	httpService.linkHttp(apiUrl.stopAudit,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	//$state.go('examine.starttrial');
                	$rootScope.isStopOrder = true;
                }
                
            });
		}*/

		//获取加签页面数据
		$scope.getPDetail = function() {
			var data = {
				'orderNo': $scope.orderNo,
				'doctorName': $scope.doctorName,
				'doctorId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.detail, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					
					if(data.data.imageUrl == ''){
						$scope.showTxtOrPDF = true;
						
					}else{
						// $scope.PDFurl = 'http://192.168.1.240/prescriptionFile/20170303/1/1_1488592962526.pdf'
						/*$timeout(function(){
							document.getElementById("pdf").src= data.data.imageUrl;
						},100)*/
						$scope.PDFurl = data.data.imageUrl;
						$scope.$watch('PDFurl',function(newVal){
							console.log(newVal)
							$timeout(function(){
								document.getElementById("pdf").src= $scope.PDFurl!=null&&$scope.PDFurl?$scope.PDFurl:'';
							},100)
						})
							
					}
					$scope.dateTime = data.data.restSecond
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
			//   status:4：不通过，3：通过     .  reason: 不通过原因  status为0时传
			if($scope.dateTime == 0) return;
			
			if(indata.status == 4) {
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
                		'PassStatus':4,
                		'notpassDescribe':$scope.notpass.Describe
                	}
                	$scope.httpAudit(_opt);
				}
				
			}else{
				
				//加签密码弹窗：
				/*ngDialog.openConfirm({
	                template: 'yanzhengma',
	                className: 'ngdialog-theme-plain ngdialog-inputYanzhenma',
	                controller: 'prescriptionauditCtrl',
	                showClose: true,
	                closeByDocument: false
	            }).then(function (value) {
	                
	            }, function (reason) {
	             	
	          	});*/
	          	
	          	$scope.jiaqianDialog();
			}
			
		}
		//输入加签密码验证和提交审单
		$scope.inputChange = function(){
			var _isnumber = reg.test($scope.form.inputpassword)
			if(!_isnumber) return;
			
			if($scope.form.inputpassword.length == 6){
				
				//$scope.inputPwdShow = true;
				
            	//此处有一个加签密码验证请求，验证成功执行以下
				var data = {
                    'doctorId': $scope.doctorId,
                    'password': Md5.hex_md5($scope.form.inputpassword)
	            }
	        	httpService.linkHttp(apiUrl.validateSignPassword,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if(rsdata.errCode == "000002") {
					}else if (rsdata.errCode == "000000") {
	                	$scope.PWDandPro = true;
	                	$scope.submitProText = '审核处理中...';
						$scope.isSubmit = false;
	                	var _opt = {
	                		'PassStatus':3,
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
			
            	//加签密码请求结果为成功后，加签请求
            	var notPD = opt.notpassDescribe || '';
            	var dataAudit = {
					'doctorId': $scope.doctorId,
					'orderNo': $scope.orderNo,
					'status': opt.PassStatus,
					'reason': notPD,
					'doctorName': $scope.doctorName
				}
	
				httpService.linkHttp(apiUrl.aduit, dataAudit).then(function(resAudit) {
					// 判断请求成功
					
					var dataPA = resAudit.data;
					console.log(dataPA);
					//成功
					if(dataPA.errCode == "000000") {
						if(opt.PassStatus == 4){
							ngDialog.close();
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
					}else{
						//不成功
						if(opt.PassStatus == 4){
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
					}
				});
            
		}
		
		
		
		//忘记密码
		$scope.wangjipassword = function() {
			ngDialog.close();
			ngDialog.openConfirm({
                template: 'UpdatePWDDialogId',
                className: 'ngdialog-theme-plain ngdialog-UpdatePWD',
                controller: 'prescriptionauditCtrl',
                showClose: false,
                closeByDocument: false,
                width:410,
                height:280
           }).then(function (value) {
				
            }, function (reason) {
             	console.log('Modal promise rejected. Reason: ', reason);
          	});
		}
		
		//发送校验码
		$scope.changeYZMStatus = function() {
			console.log($scope.form.inputPhone)
			if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.form.inputPhone))) return
			
			//console.log($rootScope.userInfo.data)		
			var data = {
                    'mobileNo': $scope.form.inputPhone,
                    'type': '9'
            }
        	httpService.linkHttp(apiUrl.getVerificationCode,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$scope.userPhoneStatus = true;
					$scope.YZMTime = 60;
					var timeYZMTime = $interval(function() {
						$scope.YZMTime--;
						if($scope.YZMTime == 0) {
							$scope.userPhoneStatus = false;
							$interval.cancel(timeYZMTime);
						}
					}, 1000);
                }
                
            });
		}
		//校验验证码
		$scope.closeYanzhengma2 = function() {
			if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.form.inputPhone))) return
			if($scope.form.inputYZM.length == ""){
				$scope.inputYZMShow = true;
			}else{
				//$scope.showChangeYZM = true;
				
	           //验证短信校验码  mobileNo type  smsCode
				var data = {
                    'mobileNo': $scope.form.inputPhone,
                    'type': '9',
                    'smsCode': $scope.form.inputYZM
	            }
	        	httpService.linkHttp(apiUrl.verificationCode,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	$scope.showChangeYZM = true;
	                }else{
	                	$scope.inputYZMShow = true;
	                }
	            });
            
			}
		}
		//重置密码提交
		$scope.updataPWD = function() {
			if($scope.form.inputNewPWD == $scope.form.inputNewPWDRepeat){
				$scope.ispwdcfPro = false;
				
	          	$timeout(function(){
					document.getElementById("mypassword").focus();
				},1000)
				//请求修改接口
				var data = {
					'doctorId': $scope.doctorId,
                    'newPassword': Md5.hex_md5($scope.form.inputNewPWD)
	            }
	        	httpService.linkHttp(apiUrl.resetSignPassword,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	ngDialog.close();
						ngDialog.openConfirm({
					        template: 'PWDDialogId',
					        className: 'ngdialog-theme-plain ngdialog-RCI',
					        controller: 'prescriptionauditCtrl',
					        showClose: false,
					        closeByDocument: false,
					        width:410,
					        height:200
					   }).then(function (value) {
							
					    }, function (reason) {
					     	//console.log('Modal promise rejected. Reason: ', reason);
					  	});
			          	
			          	
			          	$timeout(function(){
							document.getElementById("mypassword").focus();
						},1000)
	                }else{
	                	
	                }
	                
	            });
				
	          	
	          	
	          	
			}else{
				$scope.ispwdcfPro = true;
			}
		}
		//重试密码
		$scope.paswordRetry = function() {
			$scope.inputPwdShow = false;
		}
		
		$scope.jiaqianDialog = function() {
			//$rootScope.shuomin = $scope.form.prescriptionDescription
			//加签密码弹窗：
			ngDialog.close();
			ngDialog.openConfirm({
		        template: 'PWDDialogId',
		        className: 'ngdialog-theme-plain ngdialog-RCI',
		        controller: 'prescriptionauditCtrl',
		        showClose: false,
		        closeByDocument: false,
		        width:410,
		        height:200
		   }).then(function (value) {
				
		    }, function (reason) {
		     	//console.log('Modal promise rejected. Reason: ', reason);
		  	});
          	
          	
          	$timeout(function(){
				document.getElementById("mypassword").focus();
			},1000)
          	
		}

	}]).name