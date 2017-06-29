module.exports = angular.module("app.prescriptionauditVideo")
	.controller("prescriptionauditVideoCtrl", ['$scope', '$state', '$http', 'httpService', '$stateParams', '$timeout', '$rootScope', 'apiUrl', '$interval', 'ngDialog', 'Md5', function($scope, $state, $http, httpService, $stateParams, $timeout, $rootScope, apiUrl, $interval, ngDialog, Md5) {
		
		
		$scope.countDownTime =  $rootScope.timeCount || 0;
		$scope.orderNo = $state.params.orderNo || '';
		$scope.doctorId = $rootScope.userInfo.data.customerId;
		$scope.doctorName =  $rootScope.userInfo.data.name;
		$scope.isSaveUserInfo = false;
		$scope.isSaveUserPhone = false;
		$scope.quitIs = false;
		$scope.showChangeYY = false;
		$scope.haveOrderNo = false;
		
		//输入加签密码
		$scope.submitProText = '';
		$scope.PWDandPro = false;
		$scope.isSubmit = true;
		//取消接诊
		$scope.isweixy = true;
		$scope.isqita = false;
		//$scope.yyshuoming = '';
		var reg = /^[0-9]*$/;
		$scope.inputPwdShow = false;
		//手机验证码
		$scope.showChangeYZM = false;
		$scope.userPhoneStatus = false;
		$scope.inputYZMShow = false;
		$scope.YZMTime = 60;
		
		$scope.form = {
            'username': '',
            'sex': '',
            'age': '',
            'phone': '',
            'deptName':'',
            'chiefComplaint': '',
            'pastHistory': '',
            'preliminaryDiagnosis': '',
            'doctorAdvice': '',
            'patientId':'',
            'yyshuoming':'',
            'inputpassword':'',
            'inputPhone':'',
            'inputYZM':'',
            'inputNewPWD':'',
            'inputNewPWDRepeat':''
        }
		
		//计时器
		$interval(function() {
			$scope.countDownTime = $scope.countDownTime +1000;
			$rootScope.timeCount = $scope.countDownTime;
		},1000);
		
		//显示取消接诊
		$scope.showquitIs = function() {
			$scope.quitIs = !$scope.quitIs;
		}
		//点击取消接诊
		$scope.quxiaoJieZhen = function() {
			$rootScope.patientInfo = $scope.form;
			ngDialog.openConfirm({
                template: 'RCIDialogId',
                className: 'ngdialog-theme-plain ngdialog-RCI',
                controller: 'prescriptionauditVideoCtrl',
                showClose: false,
                closeByDocument: false,
                width:410,
                height:270
            }).then(function (value) {
                
				
            }, function (reason) {
             	console.log('Modal promise rejected. Reason: ', reason);
          	});
			
			
		}
		//选择原因
		$scope.toggleRememberXY = function(ot) {
			if(ot == 0){
				$scope.isweixy = true;
				$scope.isqita = false;
				document.getElementsByClassName('ngdialog-content')[0].style.height = '270px';
			}else{
				$scope.isweixy = false;
				$scope.isqita = true;
				document.getElementsByClassName('ngdialog-content')[0].style.height = '350px';
				$scope.form.yyshuoming = '';
			}
		}
		//点击提交
		$scope.yySubmit = function() {
			
			if($scope.isqita == false){
				$scope.form.yyshuoming = '患者长时间未响应';
				$rootScope.ppayyshuoming = $scope.form.yyshuoming;
				//取消问诊接口
				$scope.quxiaojiezhenSubmit($scope.form.yyshuoming);
			}else{
				var status = !(/\S/.test($scope.form.yyshuoming));
				if(!status){
					//$rootScope.ppayyshuoming = $scope.form.yyshuoming
					//$scope.goPageStuts(0);
					//取消问诊接口
					$scope.quxiaojiezhenSubmit($scope.form.yyshuoming);
				}
			}
		}
		
		//取消接诊接口
		$scope.quxiaojiezhenSubmit = function(yyT){
			//1-异常关闭,2-患者取消，3-医生取消，4-运营取消
			var data = {
				'orderNo': $scope.orderNo,
				'cancelType': '3',
				'reason': yyT
			}
			httpService.linkHttp(apiUrl.cancel, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					var _if = document.getElementById("pdf");
					var _opt = {
							'stutas':'cancel',
							'diagnose':'',
							'advice':''
						}
					_if.contentWindow.publicSendMsg(_opt);
					
					$timeout(function(){
	                	ngDialog.close();
	                	$state.go('examine.triallohandle');
	                },'2000');
					
				}else{
					//$state.go('login');
				}
			});
		}
		
		
		
		//忘记密码
		$scope.wangjipassword = function() {
			ngDialog.close();
			ngDialog.openConfirm({
                template: 'UpdatePWDDialogId',
                className: 'ngdialog-theme-plain ngdialog-UpdatePWD',
                controller: 'prescriptionauditVideoCtrl',
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
                    'type': '8'
            }
        	httpService.linkHttp(apiUrl.send2,data).then(function(res) {
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
		$scope.closeYanzhengma = function() {
			if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.form.inputPhone))) return
			if($scope.form.inputYZM.length == ""){
				$scope.inputYZMShow = true;
			}else{
				//$scope.showChangeYZM = true;
				//验证短信校验码
				var data = {
                    'mobileNo': $scope.form.inputPhone,
                    'type':'8',
                    'smsCode': $scope.form.inputYZM
	            }
	        	httpService.linkHttp(apiUrl.check,data).then(function(res) {
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
				
				//请求修改接口
				var data = {
                    'password': Md5.hex_md5($scope.form.inputNewPWD)
	            }
	        	httpService.linkHttp(apiUrl.resetSignPassword,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	$scope.goPageStuts(0);
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
		//输入加签密码验证和提交审单
		$scope.inputChange = function(){
			var _isnumber = reg.test($scope.form.inputpassword)
			if(!_isnumber) return;
			
			if($scope.form.inputpassword.length == 6){
				console.log($scope.form.inputpassword)
				//$scope.inputPwdShow = true;
				/*$scope.PWDandPro = true;
            	$scope.submitProText = '审核处理中...';
				$scope.isSubmit = false;
				$scope.httpAudit();*/
				
				//此处有一个加签密码验证请求，验证成功执行以下
				var data = {
                    'password': Md5.hex_md5($scope.form.inputpassword)
	            }
	        	httpService.linkHttp(apiUrl.validatePassword,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if(rsdata.errCode == "000002") {
					}else if (rsdata.errCode == "000000") {
	                	$scope.PWDandPro = true;
	                	$scope.submitProText = '审核处理中...';
						$scope.isSubmit = false;
	                	
	                	$scope.httpAudit(0);
	                }else{
	                	$scope.inputPwdShow = true;
	                }
	           });
			}
			
		}
		//点击修改和保存
		$scope.updataUserInfo = function() {
			$scope.isSaveUserInfo = true;
		}
		$scope.updataUserPhone = function() {
			$scope.isSaveUserPhone = true;
		}
		$scope.saveUserInfo = function() {
			
			/*var _data = {
            	'patientId': $scope.form.patientId,
            	'patientMobile': $scope.form.phone,
            	'age': $scope.form.age,
            	'sex': $scope.form.sex == '女'?'0':'1',
            	'realName': $scope.form.username
            }
			var data = {
                    'userInfo': JSON.stringify(_data)
            }
        	httpService.linkHttp(apiUrl.updateUserInfo,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$scope.isSaveUserInfo = false;
                }
                
            });*/
			$scope.isSaveUserInfo = false;
		}
		$scope.saveUserPhone = function() {
			/*var _data = {
                    	'patientId': $scope.form.patientId,
                    	'patientMobile': $scope.form.phone
                    }
			var data = {
                    'userInfo': JSON.stringify(_data)
            }
        	httpService.linkHttp(apiUrl.updateUserInfo,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$scope.isSaveUserPhone = false;
                }
                
            });*/
           $scope.isSaveUserPhone = false;
		}
		
		//联系客服
		$scope.CCService = function() {
			ngDialog.close();
			
		  	ngDialog.open({
                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >客服电话:<br/>0755-26656589</p></div>',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                plain: true,
            });
           
            
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
		$scope.pauseOver = function(staut){
			$rootScope.patientInfo = $scope.form;
			if(staut == 0){
				//$state.go('examine.triallohandle');
				
				ngDialog.open({
	                template: 'voerWenZhen',
	                className: 'ngdialog-theme-plain ngdialog-voerWenZhen',
			        controller: 'prescriptionauditVideoCtrl',
			        showClose: false,
			        closeByDocument: false,
			        width:410,
			        height:200
	            });
			}else if(staut == 1){
				var tipText = "";
				if($scope.form.chiefComplaint == ''){
					tipText = "主诉/现病史未填写。";
				}else if($scope.form.preliminaryDiagnosis == ''){
					tipText = "初步诊断未填写。";
				}else if($scope.form.chiefComplaint == '' && $scope.form.preliminaryDiagnosis == ''){
					tipText = "主诉/现病史和初步诊断未填写。";
				}else if($scope.countDownTime < 60000){
					tipText = "接诊时长过短。";	
				}else{
					tipText = "";
				}
				
				if(tipText == ""){
					//$scope.goPageStuts(1);
					$scope.httpAudit(1);
				}else{
					ngDialog.open({
		                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;">'+ tipText +'</div>',
		                className: 'ngdialog-theme-default',
		                closeByDocument: false,
		                plain: true,
		            });
				}
				
	            
				
				
			}
			
			
            
			
		}
		
		//输入加签密码弹窗 ，跳转不同页面： 0，examine.triallohandle   。 1 ， examine.prescribe
		$scope.goPageStuts = function(ot) {
			$rootScope.prescriptionFlag = ot;
			ngDialog.close();
			ngDialog.openConfirm({
		        template: 'PWDDialogId',
		        className: 'ngdialog-theme-plain ngdialog-RCI',
		        controller: 'prescriptionauditVideoCtrl',
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
		
		//结束问诊： 开处方和结束问诊
		$scope.goPrescribe = function() {
			$scope.httpAudit(1);
		}
		$scope.goTriallohandle = function() {
			$scope.httpAudit(0);
			//$state.go('examine.triallohandle');
		}
		
		
		//保存病历和开处方
		$scope.saveMedicalRecord = function() {
			if($scope.form.chiefComplaint == '' || $scope.form.preliminaryDiagnosis == ''){
				ngDialog.open({
	                template: 'chiefComplaintText',
	                controller: 'prescriptionauditVideoCtrl',
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
						
						/*var _item = JSON.parse(window.sessionStorage.getItem('patientInfo'));
				        _item.chiefComplaint = $scope.form.chiefComplaint;
				        _item.pastHistory = $scope.form.pastHistory;
				        _item.preliminaryDiagnosis = $scope.form.preliminaryDiagnosis;
				        _item.doctorAdvice = $scope.form.doctorAdvice
						window.sessionStorage.setItem('patientInfo', window.JSON.stringify(_item));*/
						
					}else{
						//$state.go('login');
					}
				});
				
			}
			
		}
		
	
		//获取加签页面数据
		$scope.getPDetail = function() {
			
			var _account = $rootScope.userInfo.data.imNo;
			var _pwd = $rootScope.userInfo.data.imToken;
			var _doctorName = $rootScope.userInfo.data.doctorName;
			
			var data = {
				'orderNo': $scope.orderNo
			}
			httpService.linkHttp(apiUrl.queryCaseDetail, data).then(function(res) {
				// 判断请求成功
				
				var data = res.data;
				console.log(data);
				if(data.errCode == "000000") {
					var _item = data.data
					$scope.form.username = _item.patientName;
					$scope.form.age = _item.age;
					$scope.form.sex = _item.sex == '0'?'女':'男';
					$scope.form.phone = _item.patientMobileNo;
					$scope.form.chiefComplaint = _item.chiefComplaint;
					$scope.form.doctorAdvice = _item.doctorAdvice;
					$scope.form.pastHistory = _item.pastHistory;
					$scope.form.preliminaryDiagnosis = _item.preliminaryDiagnosis;
					$scope.form.deptName = _item.deptName;
					$scope.form.patientId = _item.patientId;
					
					window.sessionStorage.setItem('patientInfo', window.JSON.stringify(_item));
					
					var _huanzheID = _item.imId;
					//var _huanzheID = 'xpc11';
					var _openType = 1;
					//_account = 'xpc20'
					//_pwd = '123456'
					$timeout(function(){
						document.getElementById("pdf").src= location.pathname+'NIM_Web/im/index.html?account='+_account+'&pwd='+_pwd+'&doctorName='+_doctorName+'&huanzheID='+_huanzheID+'&orderNo='+$scope.orderNo+'&patientName='+$scope.form.username+'&opentype='+_openType;
					},100)
					
					
				}else{
					
				}
			});
			
			//查询问诊单状态
	        var timePA = $interval(function() {
				if($state.current.url != '/prescriptionauditVideo/:orderNo'){
					$interval.cancel(timePA);
					return;
				} 
				if($scope.haveOrderNo) {
					
					$interval.cancel(timePA);
				}else{
					$scope.orderStatus();
				}
			}, 20000);
			
	        
	        
		}
		
		$scope.orderStatus = function(){
			
		
	       /* var _token = $rootScope.userInfo.data.token || '';
			var initdata = {
                   'orderNo': $scope.orderNo,
                   'token': _token
            }
			$http({
                method: apiUrl.orderStatus.method,
                url: apiUrl.orderStatus.url,
                params: initdata,
                data: initdata
            }).then(function(res){*/
            	
            var data = {
				'orderNo': $scope.orderNo
			}
			httpService.linkHttp(apiUrl.orderStatus, data).then(function(res) {	
            	var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	
                	if(rsdata.data == null) return;
                	
                	if(rsdata.data.orderStatus == '6' ||rsdata.data.orderStatus == '7' ||rsdata.data.orderStatus == '9' ){
                    	$scope.haveOrderNo = true;
                   
			            ngDialog.openConfirm({
							template: '<div style="    text-align: -webkit-center;text-align: center;padding-top:50px;padding-bottom:50px;">抱歉，患者刚刚取消了问诊。</div><div class="ngdialog-buttons" >\
	                    <button type="button" style="float: none;width: 160px;height: 40px;" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">返回候诊室</button>\
	                    <button type="button" style="width: 160px;height: 40px;" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
	                	</div>',
							plain: true,
							className: 'ngdialog-theme-default',
							scope: $scope,
							width:410,
							height:200,
							showClose: false,
			                closeByEscape: false,
			                closeByDocument: false
						}).then(function(value) {
							$state.go('examine.triallohandle');
						}, function(reason) {
							//console.log('取消');
						});
					}
					
                }
            },function(data,header,config,status){ //处理响应失败
                
                 $scope.haveOrderNo = false;
                
            })
			
		
		}
		
		
		$scope.httpAudit = function(opt) {
            	//加签密码请求结果为成功后，加签请求
            	
            	var data = {
                    'doctorId': $rootScope.userInfo.data.customerId,
                    'patientId':$rootScope.patientInfo.patientId,
                    'patientName':$rootScope.patientInfo.username,
                    'prescriptionFlag':opt,
                    'orderNo': $scope.orderNo,
                    'chiefComplaint':$rootScope.patientInfo.chiefComplaint,
                    'doctorAdvice':$rootScope.patientInfo.doctorAdvice,
                    'pastHistory':$rootScope.patientInfo.pastHistory,
                    'preliminaryDiagnosis':$rootScope.patientInfo.preliminaryDiagnosis
	            }
	        	httpService.linkHttp(apiUrl.over,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                
	                if(rsdata.errCode == "000000"){
	                	
	                	var _if = document.getElementById("pdf");
		            	var _opt = {
							'stutas':'',
							'diagnose':'',
							'advice':''
						}
		            	if(opt == 0){
		            		_opt.stutas = 'over_no';
				            _opt.diagnose = $rootScope.patientInfo.preliminaryDiagnosis;
				            _opt.advice = $rootScope.patientInfo.doctorAdvice;
						}else{
							_opt.stutas = 'over_has';
							_opt.diagnose = $rootScope.patientInfo.preliminaryDiagnosis;
				            _opt.advice = $rootScope.patientInfo.doctorAdvice;
						}
						_if.contentWindow.publicSendMsg(_opt);
				
				
	                	//$scope.submitProText = '操作成功！';
	                	ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >操作成功！</p></div>',
			                className: 'ngdialog-theme-default',
			                showClose: false,
			                closeByDocument: false,
			                closeByEscape: false,
			                plain: true,
			            });
						$timeout(function(){
		                	ngDialog.close();
		                	//判断是否点击停止审方
		                	if(opt == 0){
					            $state.go('examine.triallohandle');
							}else{
								$state.go('examine.prescribe',{'orderNo':$scope.orderNo});
							}
		                	
		                },'2000');
		               
		               	//处方加签
						/*var dataSign = {
		                    'doctorId': $rootScope.userInfo.data.customerId,
		                    'doctorName':$rootScope.userInfo.data.doctorName,
							'orderNo': $scope.orderNo,
							'positionX': '110',
							'positionY': '652'
			            }
			        	httpService.linkHttp(apiUrl.sign,dataSign).then(function(resSign) {
			                // 判断请求成功
			                var rsSign = resSign.data;
			                console.log(rsSign);
			                if(rsSign.errCode == "000002") {
							}else if (rsSign.errCode == "000000") {
			                	$scope.submitProText = '操作成功！';
			                	$timeout(function(){
				                	ngDialog.close();
				                	//判断是否点击停止审方
				                	if($rootScope.prescriptionFlag == 0){
							            $state.go('examine.triallohandle');
									}else{
										$state.go('examine.prescribe',{'orderNo':$scope.orderNo});
									}
				                },'2000');
			                }else{
			                	$scope.submitProText = '操作失败，请重试。';
								$scope.isSubmit = true;
			                }
			           	});*/
	                }else if(rsdata.errCode == "000002") {
					}else if(rsdata.errCode == "32001001") { //处方审核超时
							//$scope.submitProText = '提交超时，请稍后再试';
			                $timeout(function(){
			                	ngDialog.close();
			                	//$state.go('examine.starttrial');
			                },'2000');
			              
					}else{
						//$scope.submitProText = '提交失败！';
						ngDialog.open({
			                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >提交失败！</p></div>',
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
	           
	           
	
				
            
		}


	}]).name