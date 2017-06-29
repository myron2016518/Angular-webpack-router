module.exports = angular.module("app.triallohandle")
    .controller("triallohandleCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', 'ngDialog', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl,ngDialog) {
		
		// var data = {
		// 	'token': '',
		// 	'deviceType':'',
		// 	'deviceId':'',
		// 	'requestIp':'',
		// 	'systemType':'',
		// 	'senderId':'',
		// 	'receiverId':'',
		// 	'receiverSystemType':'',
		// 	'pushType':'',
		// 	'message':''
		// } 

		// httpService.linkHttp(apiUrl.messagePush,data).then(function(data){
		// 	console.log(data)
		// })
		
		// if ("WebSocket" in window)
		// {
		//    console.log("您的浏览器支持 WebSocket!");
		//    // 打开一个 web socket
		//    var ws = new WebSocket({ws:apiUrl.messagePush});
		//    ws.onopen = function()
		//    {
		//       // Web Socket 已连接上，使用 send() 方法发送数据
		//       ws.send("发送数据");
		//       alert("数据发送中...");
		//    };
			
		//    ws.onmessage = function (evt) 
		//    { 
		//       var received_msg = evt.data;
		//       alert("数据已接收...");
		//    };
			
		//    ws.onclose = function()
		//    { 
		//       // 关闭 websocket
		//       alert("连接已关闭..."); 
		//    };
		// }
		// else
		// {
		//    // 浏览器不支持 WebSocket
		//    console.log("您的浏览器不支持 WebSocket!");
		// }

		console.log('这是triallohandle:  ')
		$scope.orderNo = '';
		$scope.refreshTrial = function(){
			$scope.getTrial();
		}
		$scope.stopTrial = function(){
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
		/*$scope.goprescriptionaudit = function(){
			console.log($scope.orderNo);
			ngDialog.close();
			$state.go('examine.prescriptionaudit',{'orderNo':$scope.orderNo});
		}*/
		
		//获取数据
		$scope.getTrial = function(){
			var data = {
                    'doctorId': '217979635127'
            }
        	httpService.linkHttp(apiUrl.queryTriallohandle,data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                console.log(rsdata);
                if (rsdata.errCode == "000000") {
                    if(rsdata.data.prescriptionList.length <=0 ) return;
                    $scope.orderNo = rsdata.data.prescriptionList[0].orderNo;
                    /*ngDialog.open({
					    template: '您有新的待审核处方，请点击下方按钮开始审核。',
					    plain: true
					});*/
					/*ngDialog.open({
	                    template: 'firstDialogId',
	                    controller: 'triallohandleCtrl',
	                    className: 'ngdialog-theme-default'
	                });*/
	                ngDialog.openConfirm({
	                    template: 'firstDialogId',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    controller: 'triallohandleCtrl',
	                    showClose: false,
	                    closeByDocument: false
	                }).then(function (value) {
	                    console.log($scope.orderNo);
						ngDialog.close();
						$state.go('examine.prescriptionaudit',{'orderNo':$scope.orderNo});
	                }, function (reason) {
	                    console.log('Modal promise rejected. Reason: ', reason);
	                });
	               /* ngDialog.open({
	                    template: 'firstDialogId',
	                    controller: 'triallohandleCtrl',
	                    className: 'ngdialog-theme-plain ngdialog-Triallohandle',
	                    showClose: false,
	                    closeByDocument: false
	                });*/
                }
                
            });
		}
		
    }]).name
