module.exports = angular.module("app.prescribe")
    .controller("prescribeCtrl", ['$scope', '$state', '$http','httpService', '$stateParams', '$timeout', '$interval','$rootScope', 'apiUrl', 'ngDialog', 'Md5', function($scope, $state, $http, httpService, $stateParams, $timeout, $interval,$rootScope,apiUrl,ngDialog,Md5) {
		
	
		console.log('这是prescribe:  ')
		$scope.countDownTime = $rootScope.timeCount || 0;
		$scope.orderNo = $state.params.orderNo || '';
		$scope.isHavaDescription = true;
		$scope.inputName = '';
		$scope.ACList = [];
		$scope.patientInfo = {
            'username': '',
            'sex': '',
            'age': '',
            'phone': '',
            'chiefComplaint': '',
            'pastHistory': '',
            'preliminaryDiagnosis': '',
            'doctorAdvice': '',
            'shuomin':''
        }
		
		$scope.houzhen = {
			'total': 0,
			'videoSum': 0,
			'imageSum': 0
		}
		
		
		//输入加签密码逻辑字段
		var reg = /^[0-9]*$/;
		$scope.form = {
                'inputpassword': '',
                'prescriptionDescription':'',
                'inputPhone':'',
	            'inputYZM':'',
	            'inputNewPWD':'',
	            'inputNewPWDRepeat':''
        }
		
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
		
		
		$scope.usageList = [];
		$scope.frequencyList = [];
		$scope.unitDoseUnitsList = [];
		$scope.unitDoseList = [];
		$scope.numberList = [];
		$scope.numberUnitsList = [];
		
		//$scope.prescribeList = [];
		//计时器
		$interval(function() {
			$scope.countDownTime = $scope.countDownTime +1000;
		},1000);
		
		
		$scope.selectTest = function(a){
			console.log(a);
		}
		//初始化
		$scope.getPDetail = function() {
			
			
			console.log($rootScope.userInfo);
			/*$scope.patientInfo.chiefComplaint = '生病'
		    $scope.patientInfo.pastHistory = '咳嗽'
		    $scope.patientInfo.preliminaryDiagnosis = '吃药'
		    $scope.patientInfo.doctorAdvice = '打针'
		    $scope.patientInfo.username = '岚姐'
		    $scope.patientInfo.age = '42'
		    $scope.patientInfo.sex = '男'*/
		   
		    //处方详情
		    var data = {
                    'orderNo': $scope.orderNo
            }
        	//httpService.linkHttp(apiUrl.prescriptionDetail,data).then(function(res) {
    		httpService.linkHttp(apiUrl.queryCaseDetail,data).then(function(res) {
        		
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	var _item = rsdata.data
                	$scope.patientInfo.chiefComplaint = _item.chiefComplaint
				    $scope.patientInfo.pastHistory = _item.pastHistory
				    $scope.patientInfo.preliminaryDiagnosis = _item.preliminaryDiagnosis
				    $scope.patientInfo.doctorAdvice = _item.doctorAdvice
				    $scope.patientInfo.username = _item.patientName
				    $scope.patientInfo.age = _item.age
				    $scope.patientInfo.sex = _item.sex == '0'?'女':'男';
				    /*$scope.form.prescriptionDescription = rsdata.data.description
				    if(rsdata.data.list == undefined) return
				    if(rsdata.data.list.length > 0 ){
				    	var _itdata = rsdata.data.list;
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
				    }*/
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
            
            
            /*type有3种取值：BASE,MED,OPF
			serviceKey ： med.usage   
			med.frequency     用药频次
			med.unitDoseUnits 单次剂量单位
			单次剂量单位  med.unitDose
			数量            med.number
			 数量单位    med.numberUnits 
			 $scope.usageList = [];
			$scope.frequencyList = [];
			$scope.unitDoseUnitsList = [];
			$scope.unitDoseList = [];
			$scope.numberList = [];
			$scope.numberUnitsList = [];
			*/
			var data = {'type': 'OPF','serviceKey':'med.usage'}
        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                	if(rsdata.data.serviceList.length > 0){
                		var _itList = rsdata.data.serviceList
            			for (var j = 0; j < _itList.length; j++) {
            				var _item = _itList[j];
							$scope.usageList.push(_item.serviceValue);
						}
                	}
            	}
            });
            var data = {'type': 'OPF','serviceKey':'med.frequency'}
        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                	if(rsdata.data.serviceList.length > 0){
                		var _itList = rsdata.data.serviceList
            			for (var j = 0; j < _itList.length; j++) {
            				var _item = _itList[j];
							$scope.frequencyList.push(_item.serviceValue);
						}
                	}}
            });
           /* var data = {'type': 'OPF','serviceKey':'med.unitDose'}
        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                	if(rsdata.data.serviceList.length > 0){
                		var _itList = rsdata.data.serviceList
            			for (var j = 0; j < _itList.length; j++) {
            				var _item = _itList[j];
							$scope.unitDoseList.push(_item.serviceValue);
						}
                	}}
            });*/
            var data = {'type': 'OPF','serviceKey':'med.unitDoseUnits'}
        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                	if(rsdata.data.serviceList.length > 0){
                		var _itList = rsdata.data.serviceList
            			for (var j = 0; j < _itList.length; j++) {
            				var _item = _itList[j];
							$scope.unitDoseUnitsList.push(_item.serviceValue);
						}
                	}}
            });
          /*  var data = {'type': 'OPF','serviceKey':'med.number'}
        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                	if(rsdata.data.serviceList.length > 0){
                		var _itList = rsdata.data.serviceList
            			for (var j = 0; j < _itList.length; j++) {
            				var _item = _itList[j];
							$scope.numberList.push(_item.serviceValue);
						}
                	}}
            });*/
            var data = {'type': 'OPF','serviceKey':'med.numberUnits'}
        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                	if(rsdata.data.serviceList.length > 0){
                		var _itList = rsdata.data.serviceList
            			for (var j = 0; j < _itList.length; j++) {
            				var _item = _itList[j];
							$scope.numberUnitsList.push(_item.serviceValue);
						}
                	}}
            });
	            
	            
            
		}
	
		//清空药品
		$scope.del=function(idx){
		    //$scope.prescribeInputList.splice(idx,1);
		    $scope.prescribeInputList[idx].drugId = '';
		    $scope.prescribeInputList[idx].drugName.name = '';
		    $scope.prescribeInputList[idx].specifications.name = '';
		    $scope.prescribeInputList[idx].usage.name = '0';
		    $scope.prescribeInputList[idx].frequency.name = '0';
		    $scope.prescribeInputList[idx].unitDose.name = '';
		    $scope.prescribeInputList[idx].unitDoseUnits.name = '0';
		    $scope.prescribeInputList[idx].amount.name = '';
		    $scope.prescribeInputList[idx].numberUnits.name = '0';
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
			if($scope.prescribeInputList[idx][name].name == '') return;
			for (var i = 0; i < $scope.prescribeInputList.length; i++) {
				$scope.prescribeInputList[i].isShowAC = false;
			}
			$scope.prescribeInputList[idx].isShowAC = true;
			$scope.inputName = name;
			//获取数据
			$scope.ACList = [];
			if(name == 'drugName'){
    			var data = {
                    'drugName': $scope.prescribeInputList[idx][name].name
	            }
	        	httpService.linkHttp(apiUrl.drugList,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	if(rsdata.data.drugList.length > 0){
	                		var _itList = rsdata.data.drugList
	                		if(name == 'drugName'){
	                			for (var j = 0; j < _itList.length; j++) {
	                				var _item = _itList[j];
									$scope.ACList.push({'drugId':_item.drugId,'drugName':_item.genericName,'specifications':_item.specifications})
								}
							}else{
								//$scope.ACList = [];
							}
	                	}else{
	                		$scope.ACList = [];
	                	}
	                	
	                }
	                
	            });
			}else if(name == 'usage'){
				//type有3种取值：BASE,MED,OPF
				//serviceKey ： med.usage   
				var data = {
                    'type': 'OPF',
                    'serviceKey':'med.usage'
	            }
	        	httpService.linkHttp(apiUrl.serviceValueList,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	if(rsdata.data.serviceList.length > 0){
	                		var _itList = rsdata.data.serviceList
                			for (var j = 0; j < _itList.length; j++) {
                				var _item = _itList[j];
								$scope.ACList.push({'drugId':_item.id,'drugName':_item.serviceValue})
							}
	                	}else{
	                		$scope.ACList = [];
	                	}
	                	
	                }
	                
	            });
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
					if(itemOb.name == '' || itemOb.name == '0'){
						_isShowItem = true;
					}else {
						_isShowItem2 = true;
					}
				});
				if(_isShowItem == true && _isShowItem2 == true){
					_isShowDialog = true;
					
					angular.forEach(_itmeObj, function(itemOb,itemName,array){
						if(angular.isUndefined(itemOb.name)) return;
						if(itemOb.name == '' || itemOb.name == '0'){
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
		
		
		//忘记密码
		$scope.wangjipassword = function() {
			ngDialog.close();
			ngDialog.openConfirm({
                template: 'UpdatePWDDialogId',
                className: 'ngdialog-theme-plain ngdialog-UpdatePWD',
                controller: 'prescribeCtrl',
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
	                	ngDialog.close();
						ngDialog.openConfirm({
					        template: 'PWDDialogId',
					        className: 'ngdialog-theme-plain ngdialog-RCI',
					        controller: 'prescribeCtrl',
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
			$rootScope.shuomin = $scope.form.prescriptionDescription
			//加签密码弹窗：
			ngDialog.close();
			ngDialog.openConfirm({
		        template: 'PWDDialogId',
		        className: 'ngdialog-theme-plain ngdialog-RCI',
		        controller: 'prescribeCtrl',
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
	                
	                if(rsdata.errCode == "000001") {
	                	$scope.PWDandPro = true;
	                	$scope.submitProText = '请求异常!';
						$scope.isSubmit = false;
	                }else if(rsdata.errCode == "000002") {
					}else if (rsdata.errCode == "000000") {
	                	$scope.PWDandPro = true;
	                	$scope.submitProText = '审核处理中...';
						$scope.isSubmit = false;
	                	
	                	$scope.httpAudit();
	                }else{
	                	$scope.inputPwdShow = true;
	                }
	           });
			}
			
		}
		
		$scope.getErrorDiaolg =function() {
			ngDialog.close();
			ngDialog.open({
                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请求失败！</p></div>',
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
		$scope.httpAudit = function(opt) {
				/*console.log($rootScope.prescribeList);
				$scope.submitProText = '操作成功！';
				$timeout(function(){
                	ngDialog.close();
                	$state.go('examine.triallohandle');
                
                },'2000');*/
               
               console.log(JSON.stringify($rootScope.prescribeList));
               console.log($rootScope.shuomin);
            	//加签密码请求结果为成功后，加签请求
            	var notPD = $rootScope.shuomin || '';
            	var dataAudit = {
					'doctorId': $rootScope.userInfo.data.customerId,
					'orderNo': $scope.orderNo,
					'list': JSON.stringify($rootScope.prescribeList),
					'description': notPD
				}
	
				httpService.linkHttp(apiUrl.submit, dataAudit).then(function(resAudit) {
					// 判断请求成功
					
					var dataPA = resAudit.data;
					console.log(dataPA);
					
					if(dataPA.errCode == "000000"){
						//处方加签
							var dataSign = {
			                    'doctorId': $rootScope.userInfo.data.customerId,
			                    'doctorName':$rootScope.userInfo.data.doctorName,
								'orderNo': $scope.orderNo
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
					                	/*if($rootScope.isStopOrder){
					                		$state.go('examine.starttrial');
					                	}else{
					                		$state.go('examine.triallohandle');
					                	}*/
					                	$state.go('examine.triallohandle');
					                },'2000');
				                }else{
				                	$scope.submitProText = '操作失败，请重试。';
									$scope.isSubmit = true;
				                }
				           	});
					}else if(dataPA.errCode == "000002") {
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
							$scope.getErrorDiaolg();
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
