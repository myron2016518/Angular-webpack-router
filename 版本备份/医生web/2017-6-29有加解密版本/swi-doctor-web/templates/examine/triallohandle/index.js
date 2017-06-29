module.exports = angular.module("app.triallohandle")
    .controller("triallohandleCtrl", ['$scope', '$state', '$http','httpService', '$stateParams', '$timeout', '$interval','$rootScope', 'apiUrl', 'ngDialog', function($scope, $state, $http, httpService, $stateParams, $timeout, $interval,$rootScope,apiUrl,ngDialog) {
		
	
		console.log('这是triallohandle:  ')
		$scope.orderNo = '';
		$scope.haveOrderNo = false;
		$scope.stopJiedan = false;
		$scope.yijiezhen = {
			'total': 0,
			'videoSum': 0,
			'imageTextSum': 0
		}
		$scope.houzhen = {
			'total': 0,
			'videoSum': 0,
			'imageSum': 0
		}
		/*$scope.patientInfo = {
			'orderNo':'',
			'patientId':'',
			'imId':'',
			'sexTxt':'',
			'sex':'',
			'age':'',
			'patientName':'',
			'inquiryTypeName':'',
			'chiefComplaint':'',
			'reason':'',
			'submitDate':''
		}*/
		$scope.PWDandPro = false;
		$scope.refreshTrial = function(){
			$scope.getTrial(0);
		}
		//暂停接单
		$scope.pauseInquiry = function(){
			newMessageRemind.clear();
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
		
		
		$scope.initTriall = function() {
			$scope.getInfo();
			var time = $interval(function() {
				if($state.current.url != '/triallohandle'){
					$interval.cancel(time);
					return;
				} 
				if($scope.haveOrderNo || $scope.stopJiedan) {
					
					$interval.cancel(time);
				}else{
					/*newMessageRemind.show();
					document.getElementById("sound").src="http://sit-houtai.siruijk.com/web-images/tgr.mp3";
					$scope.desktopTips({'title':'思瑞健康','content':'您有新的患者待接诊。'});*/
					$scope.getTrial(1);
				}
			}, 10000);
			
		}
		
		var newMessageRemind={
				_step: 0,
				_title: document.title,
				_timer: null,
				//显示新消息提示
				show:function(){
					var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
					newMessageRemind._timer = setTimeout(function() {
					newMessageRemind.show();
					//这里写Cookie操作
					newMessageRemind._step++;
					if (newMessageRemind._step == 3) { newMessageRemind._step = 1 };
					if (newMessageRemind._step == 1) { document.title = "【　　　】" + temps };
					if (newMessageRemind._step == 2) { document.title = "【新消息】" + temps };
					}, 800);
					return [newMessageRemind._timer, newMessageRemind._title];
				},
				//取消新消息提示
				clear: function(){
					clearTimeout(newMessageRemind._timer );
					document.title = '接诊室';
					//这里写Cookie操作
				}
				
		};
		
		$scope.getInfo = function(){
			//今日接诊人数
			var _getDate = new Date();
			var _result=_getDate.getFullYear()+'-'+(_getDate.getMonth()+1)+'-'+_getDate.getDate() +' 23:59:00';
			console.log(_result)
			var data = {
                'doctorId': $rootScope.userInfo.data.customerId,
                'endDate': _result
            }
        	httpService.linkHttp(apiUrl.sumRecord,data).then(function(res) {
                // 判断请求成功
                var data = res.data;
               
                if (data.errCode == "000000") {
                     console.log(data);
                     
                     $scope.yijiezhen.videoSum = data.data.videoSum  || 0
                     $scope.yijiezhen.imageTextSum = data.data.imageTextSum || 0
                     $scope.yijiezhen.total = parseInt($scope.yijiezhen.videoSum)  + parseInt($scope.yijiezhen.imageTextSum) || 0
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
                     $scope.houzhen.videoSum = data.data.videoSum  || 0
                     $scope.houzhen.imageSum = data.data.imageSum || 0
                     $scope.houzhen.total = parseInt($scope.houzhen.videoSum)  + parseInt($scope.houzhen.imageSum) || 0
                     
                }
                
            });
            
		}
		
		
		
		
		//获取接诊数据
		$scope.getTrial = function(opt){
			var _urlOB = opt == 0 ? apiUrl.queueList :apiUrl.queueListNoLoad;
			var data = {
                    'doctorId': $rootScope.userInfo.data.customerId
            }
        	httpService.linkHttp(_urlOB,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                	
                	if(rsdata.data == null) return;
                	if(rsdata.data.orderNo == "" ) return;
                	//$scope.desktopTips({'title':'思瑞健康','content':'您有新的患者待接诊。'});
                    $scope.haveOrderNo = true;
                    $scope.orderNo = rsdata.data.orderNo;
                    
                    console.log($rootScope.userInfo);
                    var _ngID = '';
                    var _goPage = '';
                    var _goPagedata = {};
                    var _content = '';
                    
                    // 0：图文 1：视频 2处方打回
                    if( rsdata.data.type == '1'){	
                    	var _chiefComplaint = rsdata.data.chiefComplaint;
                    	var _sex = rsdata.data.sex == '0'?'女':'男';
                    	var _age = rsdata.data.age;
                    	var _patientName = rsdata.data.patientName;
                    	_ngID = '<div class="ngdialog-message"><div class="titleNgM">您有新的视频/图文问诊咨询</div><p class="del1">患者：'+ _patientName +'，'+ _sex +'，'+ _age +'岁。</p><p class="del1">'+ _chiefComplaint +'</p></div><div class="ngdialog-buttons"><button type="button" class="ngdialog-button" style="display: inline;" ng-click="confirm()">接诊</button><p class="tishi2">请尽快接诊，以免患者在药店长时间等待。</p></div>';
                    	_goPagedata = {'orderNo':$scope.orderNo};
                    	_content = '您有新的患者待接诊。';
                    	if(rsdata.data.inquiryTypeName == '1'){
                    		_goPage = 'examine.prescriptionaudit';
                    	}else{
                    		_goPage = 'examine.prescriptionauditVideo';
                    	}
                    }else if(rsdata.data.type == '2'){
                    	//_ngID = 'updatePrescribe';
                    	_goPage = 'examine.prescribe';
                    	_goPagedata = {'orderNo':$scope.orderNo};
                    	var _patientName = rsdata.data.patientName;
                    	var _submitDate = rsdata.data.submitDate;
                    	var _reason = rsdata.data.reason;
						var newDate = new Date();
						newDate.setTime(_submitDate * 1000);
						_submitDate = newDate.toLocaleString();
                    	_ngID = '<div class="ngdialog-message"><div class="titleNgM">您有一个审核未通过的处方，请修改处方后再接诊。</div><p class="del1" style="text-align: center;text-align: -webkit-center;">您于'+_submitDate+' 给患者'+_patientName+'开的处方审核未通过。</p><p class="del1" style="text-align: center;text-align: -webkit-center;">未通过说明：'+_reason+'</p></div><div class="ngdialog-buttons"><button type="button" class="ngdialog-button" style="display: inline;" ng-click="confirm()">修改处方</button><p class="tishi2">请尽快修改处方并提交审核，以免患者在药店等待取药时间过长。</p></div>';
                    	_content = '您有一张待修改的处方笺。';
                    }
                    
                    //console.log($scope.patientInfo);
                  	ngDialog.close();
                    //弹出提示
	                ngDialog.openConfirm({
	                    template: _ngID,
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    controller: 'triallohandleCtrl',
	                    showClose: false,
	                    closeByDocument: false,
                    	closeByEscape: false,
                    	plain: true,
                    	width:600
	                }).then(function (value) {
	                	newMessageRemind.clear();
	                    console.log($scope.orderNo);
	                    var dataStart = {
							'orderNo': $scope.orderNo
						}
						httpService.linkHttp(apiUrl.start, dataStart).then(function(res) {
							// 判断请求成功
							var data = res.data;
							console.log(res);
							if(data.errCode == "000000") {
								ngDialog.close();
								$state.go(_goPage,_goPagedata);
							}else{
								
							}
						});
						
	                }, function (reason) {
	                    console.log('Modal promise rejected. Reason: ', reason);
	                });
	                
	                //消息提示
	                newMessageRemind.show();
					document.getElementById("sound").src="http://sit-houtai.siruijk.com/web-images/tgr.mp3";
					$scope.desktopTips({'title':'思瑞健康','content':_content});
					
                }
                
            },function(data,header,config,status){ //处理响应失败
               	$scope.haveOrderNo = true;
                
            });
		}
		
		//桌面提醒问诊单
			/*- 标题：思瑞健康
			- 内容：您有新的患者待接诊。
			待修改的处方
			- 标题：思瑞健康
			- 内容：您有一张待修改的处方笺。*/
		$scope.desktopTips = function(opt) {
			var title = opt.title || '';
			var content = opt.content || '';
			//var iconUrl = opt.iconUrl || './img/icon_logo.png';
			var iconUrl = opt.iconUrl || 'http://sit-houtai.siruijk.com/web-images/logo.png'; 
			
			if(!title && !content){
	            title = "思瑞健康";
	            content = "您有新的信息，请及时查收。";
	        }
			
			
			if (window.webkitNotifications) {
	            //chrome老版本
	            if (window.webkitNotifications.checkPermission() == 0) {
	                var notif = window.webkitNotifications.createNotification(iconUrl, title, content);
	                notif.display = function() {}
	                notif.onerror = function() {}
	                notif.onclose = function() {}
	                notif.onclick = function() {this.cancel();}
	                notif.replaceId = 'Meteoric';
	                notif.show();
	            } else {
	                window.webkitNotifications.requestPermission($jy.notify);
	            }
	        }
	        else if("Notification" in window){
	            // 判断是否有权限
	            console.log(iconUrl);
	            if (Notification.permission === "granted") {
	                var notification = new Notification(title, {
	                	"icon": iconUrl,
	                    "body": content,
	                });
	                 notification.onshow = function(){
		                console.log("You got me!");
		            };
		            notification.onclick = function() {
		                //alert("You clicked me!");
		                //window.location = "/";
		            };
		            notification.onclose = function(){
		                console.log("notification closed!");
		            };        
		            notification.onerror = function() {
		                console.log("An error accured");
		            }
	            }
	            //如果没权限，则请求权限
	            else if (Notification.permission !== 'denied') {
	                Notification.requestPermission(function(permission) {
	                    // Whatever the user answers, we make sure we store the
	                    // information
	                    if (!('permission' in Notification)) {
	                        Notification.permission = permission;
	                    }
	                    //如果接受请求
	                    if (permission === "granted") {
	                        var notification = new Notification(title, {
	                        	"icon": iconUrl,
	                            "body": content,
	                        });
	                    }
	                });
	            }
	        }
		}
		
    }]).name
