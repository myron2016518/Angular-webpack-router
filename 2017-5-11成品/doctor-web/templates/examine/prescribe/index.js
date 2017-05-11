module.exports = angular.module("app.prescribe")
    .controller("prescribeCtrl", ['$scope', '$state', '$http','httpService', '$stateParams', '$timeout', '$interval','$rootScope', 'apiUrl', 'ngDialog', 'Md5', function($scope, $state, $http, httpService, $stateParams, $timeout, $interval,$rootScope,apiUrl,ngDialog,Md5) {
		
	
		console.log('这是prescribe:  ')
		$scope.countDownTime = $rootScope.timeCount || 0;
		$scope.orderNo = $state.params.orderNo || '';
		$scope.isHavaDescription = true;
		$scope.inputName = '';
		$scope.ACList = [];
		$scope.prescriptionDescription = '';
		$scope.patientInfo = {
            'username': '',
            'sex': '',
            'age': '',
            'phone': '',
            'chiefComplaint': '',
            'pastHistory': '',
            'preliminaryDiagnosis': '',
            'doctorAdvice': '',
        }
		
		$scope.houzhen = {
			'total': 0,
			'videoSum': 0,
			'imageSum': 0
		}
		
		
		//输入加签密码逻辑字段
		var reg = /^[0-9]*$/;
		$scope.PWDandPro = true;
		$scope.inputPwdShow = false;
		$scope.isSubmit = true;
		$scope.submitProText = '';
		$scope.form = {
                'inputpassword': ''
        }
		

		// 药品id：drugId ，药品名称：drugName ，规格：specifications，用法：usage，用药频次：frequency，单次剂量：unitDose，单次剂量的单位：unitDoseUnits，开药量:amount，数量的单位： numberUnits，

		/*$scope.prescribeInputList = [
			{'drugId':'1','drugName':{'name':'感冒灵胶囊1','stauts':true},'specifications':{'name':'0.25g10粒×2板','stauts':true},'usage':{'name':'口服','stauts':true},'frequency':{'name':'一日3次','stauts':true},'unitDose':{'name':'0.1','stauts':true},'unitDoseUnits':{'name':'g','stauts':true},'amount':{'name':'1','stauts':true},'numberUnits':{'name':'盒','stauts':true},'isShowAC':false}
    		,{'drugId':'2','drugName':{'name':'感冒灵胶囊2','stauts':true},'specifications':{'name':'0.25g10粒×2板','stauts':true},'usage':{'name':'口服','stauts':true},'frequency':{'name':'一日3次','stauts':true},'unitDose':{'name':'0.1','stauts':true},'unitDoseUnits':{'name':'g','stauts':true},'amount':{'name':'1','stauts':true},'numberUnits':{'name':'盒','stauts':true},'isShowAC':false}
    		,{'drugId':'3','drugName':{'name':'感冒灵胶囊3','stauts':true},'specifications':{'name':'0.25g10粒×2板','stauts':true},'usage':{'name':'口服','stauts':true},'frequency':{'name':'一日3次','stauts':true},'unitDose':{'name':'0.1','stauts':true},'unitDoseUnits':{'name':'g','stauts':true},'amount':{'name':'1','stauts':true},'numberUnits':{'name':'盒','stauts':true},'isShowAC':false}
    		,{'drugId':'4','drugName':{'name':'感冒灵胶囊4','stauts':true},'specifications':{'name':'0.25g10粒×2板','stauts':true},'usage':{'name':'口服','stauts':true},'frequency':{'name':'一日3次','stauts':true},'unitDose':{'name':'0.1','stauts':true},'unitDoseUnits':{'name':'g','stauts':true},'amount':{'name':'1','stauts':true},'numberUnits':{'name':'盒','stauts':true},'isShowAC':false}
    		,{'drugId':'5','drugName':{'name':'感冒灵胶囊5','stauts':true},'specifications':{'name':'0.25g10粒×2板','stauts':true},'usage':{'name':'口服','stauts':true},'frequency':{'name':'一日3次','stauts':true},'unitDose':{'name':'0.1','stauts':true},'unitDoseUnits':{'name':'g','stauts':true},'amount':{'name':'1','stauts':true},'numberUnits':{'name':'盒','stauts':true},'isShowAC':false}
    		
		];*/
		$scope.prescribeInputList = [
			{'drugId':'','drugName':{'name':'','stauts':true},'specifications':{'name':'','stauts':true},'usage':{'name':'','stauts':true},'frequency':{'name':'','stauts':true},'unitDose':{'name':'','stauts':true},'unitDoseUnits':{'name':'','stauts':true},'amount':{'name':'','stauts':true},'numberUnits':{'name':'','stauts':true},'isShowAC':false}
    		,{'drugId':'','drugName':{'name':'','stauts':true},'specifications':{'name':'','stauts':true},'usage':{'name':'','stauts':true},'frequency':{'name':'','stauts':true},'unitDose':{'name':'','stauts':true},'unitDoseUnits':{'name':'','stauts':true},'amount':{'name':'','stauts':true},'numberUnits':{'name':'','stauts':true},'isShowAC':false}
    		,{'drugId':'','drugName':{'name':'','stauts':true},'specifications':{'name':'','stauts':true},'usage':{'name':'','stauts':true},'frequency':{'name':'','stauts':true},'unitDose':{'name':'','stauts':true},'unitDoseUnits':{'name':'','stauts':true},'amount':{'name':'','stauts':true},'numberUnits':{'name':'','stauts':true},'isShowAC':false}
    		,{'drugId':'','drugName':{'name':'','stauts':true},'specifications':{'name':'','stauts':true},'usage':{'name':'','stauts':true},'frequency':{'name':'','stauts':true},'unitDose':{'name':'','stauts':true},'unitDoseUnits':{'name':'','stauts':true},'amount':{'name':'','stauts':true},'numberUnits':{'name':'','stauts':true},'isShowAC':false}
    		,{'drugId':'','drugName':{'name':'','stauts':true},'specifications':{'name':'','stauts':true},'usage':{'name':'','stauts':true},'frequency':{'name':'','stauts':true},'unitDose':{'name':'','stauts':true},'unitDoseUnits':{'name':'','stauts':true},'amount':{'name':'','stauts':true},'numberUnits':{'name':'','stauts':true},'isShowAC':false}
    		
		];
		
		//$scope.prescribeList = [];
		//计时器
		$interval(function() {
			$scope.countDownTime = $scope.countDownTime +1000;
		},1000);
		
		//初始化
		$scope.getPDetail = function() {
			
			
		   /* $scope.patientInfo.chiefComplaint = '间断呼吸困难2年，加重伴下肢水肿4天。'
		    $scope.patientInfo.pastHistory = '糖尿病，高血压。'
		    $scope.patientInfo.preliminaryDiagnosis = '充血性心力衰竭'
		    $scope.patientInfo.doctorAdvice = '可以练习趴墙，手尽量上举，每天用热毛巾热敷半小时；也可趴在床上手向前伸，或作梳头动作；锻炼过程会疼，越锻炼疼痛越轻！'
		    */
		    //处方详情
		    var data = {
                    'orderNo': $scope.orderNo
            }
        	httpService.linkHttp(apiUrl.prescriptionDetail,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	$scope.patientInfo.chiefComplaint = rsdata.data.chiefComplaint
				    $scope.patientInfo.pastHistory = rsdata.data.pastHistory
				    $scope.patientInfo.preliminaryDiagnosis = rsdata.data.preliminaryDiagnosis
				    $scope.patientInfo.doctorAdvice = rsdata.data.doctorAdvice
				    if(rsdata.data.prescriptionDrugList.length > 0 ){
				    	var _itdata = rsdata.data.prescriptionDrugList;
				    	for (var i = 0; i < _itdata.length; i++) {
				    		var _item = _itdata[i];
				    		$scope.prescribeInputList[i].drugId = _item.drugId;
						    $scope.prescribeInputList[i].drugName.name = _item.drugName;
						    $scope.prescribeInputList[i].specifications.name = _item.specifications;
						    $scope.prescribeInputList[i].usage.name = _item.usage;
						    $scope.prescribeInputList[i].frequency.name = _item.frequency;
						    $scope.prescribeInputList[i].unitDose.name = _item.unitDose;
						    $scope.prescribeInputList[i].unitDoseUnits.name = _item.unitDoseUnits;
						    $scope.prescribeInputList[i].amount.name = _item.number;
						    $scope.prescribeInputList[i].numberUnits.name = _item.numberUnits;
				    		
				    	}
				    }
                }
                
            });
            
            //候诊中
			var dataQueue = {
                'doctorId': $rootScope.userInfo.data.customerId
            }
        	httpService.linkHttp(apiUrl.queueNumber,dataQueue).then(function(resQ) {
                // 判断请求成功
                var data = resQ.data;
               
                if (data.errCode == "000000") {
                     console.log(data);
                    
                     $scope.houzhen.videoSum = data.data.videoSum  || 0
                     $scope.houzhen.imageSum = data.data.imageSum || 0
                     $scope.houzhen.total = parseInt($scope.houzhen.videoSum)  + parseInt($scope.houzhen.imageSum) || 0
                }
                
            });
            
            
            
		}
	
		//清空药品
		$scope.del=function(idx){
		    //$scope.prescribeInputList.splice(idx,1);
		    $scope.prescribeInputList[idx].drugId = '';
		    $scope.prescribeInputList[idx].drugName.name = '';
		    $scope.prescribeInputList[idx].specifications.name = '';
		    $scope.prescribeInputList[idx].usage.name = '';
		    $scope.prescribeInputList[idx].frequency.name = '';
		    $scope.prescribeInputList[idx].unitDose.name = '';
		    $scope.prescribeInputList[idx].unitDoseUnits.name = '';
		    $scope.prescribeInputList[idx].amount.name = '';
		    $scope.prescribeInputList[idx].numberUnits.name = '';
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
                	$scope.stopJiedan = true;
                }
                
            });
			
		}
		//输入获取自动关联
		$scope.inputprescribe = function(idx,name) {
			for (var i = 0; i < $scope.prescribeInputList.length; i++) {
				$scope.prescribeInputList[i].isShowAC = false;
			}
			$scope.prescribeInputList[idx].isShowAC = true;
			$scope.inputName = name;
			//获取数据
			var data = {
                    'drugName': $scope.prescribeInputList[idx][name].name
            }
        	httpService.linkHttp(apiUrl.drugList,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	
                }
                
            });
            
            
			if(name == 'drugName'){
				$scope.ACList = [
						{'drugId':'6','drugName':'感康1','specifications':'0.25g10粒×6板'}
						,{'drugId':'7','drugName':'感康2','specifications':'0.25g10粒×7板'}
						,{'drugId':'8','drugName':'感康3','specifications':'0.25g10粒×8板'}
						,{'drugId':'9','drugName':'感康4','specifications':'0.25g10粒×9板'}
						,{'drugId':'10','drugName':'感康5','specifications':'0.25g10粒×10板'}
				];
			}else{
				$scope.ACList = [];
			}
		}
		//选择自动关联
		$scope.selectprescribe = function(idx,txt) {
			console.log(idx);
			$scope.prescribeInputList[idx].drugId = txt.drugId;
			$scope.prescribeInputList[idx][$scope.inputName].name = txt.drugName;
			$scope.prescribeInputList[idx]['specifications'].name = txt.specifications;
			$scope.prescribeInputList[idx].isShowAC = false;
		}
		//提交处方:验证 。 请求在 jiaqianDialog 函数中执行
		$scope.submitprescribe = function() {
			var _objList = $scope.prescribeInputList;
			var _isShowDialog = false;
			var _submintList = [];
			for (var i = 0; i < _objList.length; i++) {
				var _itmeObj = _objList[i];
				var _isShowItem = false;
				var _isShowItem2 = false;
				angular.forEach(_itmeObj, function(itemOb,itemName,array){
					if(angular.isUndefined(itemOb.name)) return;
					if(itemOb.name == ''){
						_isShowItem = true;
					}else {
						_isShowItem2 = true;
					}
				});
				if(_isShowItem == true && _isShowItem2 == true){
					_isShowDialog = true;
					
					angular.forEach(_itmeObj, function(itemOb,itemName,array){
						if(angular.isUndefined(itemOb.name)) return;
						if(itemOb.name == ''){
							$scope.prescribeInputList[i][itemName].stauts = false;
						}else {
							
							if($scope.prescribeInputList[i][itemName].stauts == false){
								$scope.prescribeInputList[i][itemName].stauts = true;
							}
						}
						
					});
					
				}else{
					angular.forEach(_itmeObj, function(itemOb,itemName,array){
						if(angular.isUndefined(itemOb.name)) return;
						$scope.prescribeInputList[i][itemName].stauts = true;
					});
				}
				//保存数据
				if(_isShowItem == false && _isShowItem2 == true){
					var _itmeli = {'drugId':_itmeObj.drugId};
					angular.forEach(_itmeObj, function(itemOb,itemName,array){
						if(angular.isUndefined(itemOb.name)) return;
						_itmeli[itemName] = itemOb.name;
					});
					_submintList.push(_itmeli);
				}
			}
			
			if(_isShowDialog){
				var _ngD = ngDialog.open({
	                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请填写完整数据！</p></div>',
	                className: 'ngdialog-theme-default',
	                showClose: false,
	                closeByDocument: false,
	                closeByEscape: false,
	                plain: true,
	            });
	            $timeout(function(){
                	_ngD.close();
                },'2000');
			}else{
				console.log(_submintList);
				$rootScope.prescribeList = _submintList ;
				$scope.jiaqianDialog();
			}
		}
		
		
		$scope.jiaqianDialog = function() {
			//加签密码弹窗：
			ngDialog.openConfirm({
                template: 'inputPWDDialogId',
                className: 'ngdialog-theme-plain ngdialog-inputPWD',
                controller: 'prescribeCtrl',
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
		
		//输入加签密码验证和提交审单
		$scope.inputChange = function(){
			var _isnumber = reg.test($scope.form.inputpassword)
			if(!_isnumber) return;
			
			if($scope.form.inputpassword.length == 6){
			   	
				//此处有一个加签密码验证请求，验证成功执行以下
				var data = {
                    'password': Md5.hex_md5($scope.form.inputpassword+'THGDHbtzhy7lN3do')
	            }
	        	httpService.linkHttp(apiUrl.validatePassword,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if(rsdata.errCode == "000002") {
					}else if (rsdata.errCode == "000000") {
	                	$scope.PWDandPro = false;
	                	$scope.submitProText = '审核处理中...';
						$scope.isSubmit = false;
						var _pd= $scope.prescriptionDescription || '';
	                	var _opt = {
	                		'PassStatus':1,
	                		'notpassDescribe':_pd
	                	}
	                	$scope.httpAudit(_opt);
	                }else{
	                	console.log(rsdata.errCode);
	                	$scope.inputPwdShow = true;
	                }
	           });
			}
			
		}
		
		
		$scope.httpAudit = function(opt) {
				/*console.log($rootScope.prescribeList);
				$scope.submitProText = '操作成功！';
				$timeout(function(){
                	ngDialog.close();
                	$state.go('examine.triallohandle');
                
                },'2000');*/
               
               console.log(JSON.stringify($rootScope.prescribeList));
               console.log(opt.notpassDescribe);
            	//加签密码请求结果为成功后，加签请求
            	var notPD = opt.notpassDescribe || '';
            	var dataAudit = {
					'doctorId': $rootScope.userInfo.data.customerId,
					'orderNo': $scope.orderNo,
					'list': JSON.stringify($rootScope.prescribeList),
					'shuomin': notPD
				}
	
				httpService.linkHttp(apiUrl.submit, dataAudit).then(function(resAudit) {
					// 判断请求成功
					
					var dataPA = resAudit.data;
					console.log(dataPA);
					
					if(dataPA.errCode == "000002") {
					}else if(dataPA.errCode == "32001001") { //处方审核超时
							ngDialog.close();
							ngDialog.open({
			                    template: 'timeoutPrompt',
			                    controller: 'prescribeCtrl',
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
