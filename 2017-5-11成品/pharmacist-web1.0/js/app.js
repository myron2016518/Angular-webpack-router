'use strict';
//var baseUrl = 'http://dev-admin.siruijk.com:8207'
//var baseUrl = 'http://sit-admin.siruijk.com:8083'
//var baseUrl = 'http://test-houtai.siruijk.com:8083'
var baseUrl = 'http://poc-houtai.siruijk.com:8083'
//var baseUrl = 'https://uat-admin1.siruijk.com:8083'
require('../css/style.css');
require('../css/common.css');
require('../lib/ngDialog/css/ngDialog-custom-width.css')
require('../lib/ngDialog/css/ngDialog-theme-default.css')
require('../lib/ngDialog/css/ngDialog-theme-plain.css')
require('../lib/ngDialog/css/ngDialog.css')
require('../lib/ngDialog/ngDialog.js')
require('../lib/md5.js')
var app = angular.module('app', [
        require('angular-ui-router'),
        require('angular-animate'),
        require('oclazyload'),
        require('./routers.js'),
        require('./directives.js'),
        require('./services.js'),
        require('./filters.js'),
        'ngDialog',
        'Encrypt'
    ])
    .run(function($rootScope, $state, ngDialog) {

        //动态改变title
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        	$rootScope.isStopOrder =  false;
        	$rootScope.stopTime = false;
            ngDialog.close();
            $rootScope.userInfo = JSON.parse(window.sessionStorage.getItem('user'))
        	if(!$rootScope.userInfo){
        		if($state.current.url != '/agreement'){
        			$state.go('login')
				} 
            }
            $rootScope.title = toState.title
            $rootScope.isHead = toState.isHead
            $rootScope.headClick = toState.headClick != undefined?toState.headClick:true
            console.log($rootScope.headClick)
            // var body = document.getElementsByTagName('body')[0];
            // document.title = toState.title;
            // console.log(toState)
            // if (toState.url == '/login' && window.sessionStorage.getItem('user')) {
            //     window.history.back()
            // }
        });

        //视图渲染前
        $rootScope.$on('$viewContentLoading', function(event, viewConfig) {
            $rootScope.loader = true;
        });

        //视图渲染后
        $rootScope.$on('$viewContentLoaded', function(event, viewConfig) {
            $rootScope.loader = false;
        });



    })

.config(['$httpProvider', '$urlRouterProvider', '$locationProvider', function($httpProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/login");
    // $locationProvider.html5Mode(true);
    // 设置后请求带cookies
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        if (subValue != null) {
                            // fullSubName = name + '[' + subName + ']';
                            //user.userName = hmm & user.userPassword = 111
                            fullSubName = name + '.' + subName;
                            // fullSubName =  subName;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                } else if (value !== undefined) //&& value !== null
                {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }]
    $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

//启动控制器
.controller("mainCtrl", ['$scope', '$state', '$rootScope', '$timeout','$location', 'Md5', 'apiUrl', 'ngDialog', 'httpService', function($scope, $state, $rootScope, $timeout, $location, Md5, apiUrl, ngDialog, httpService) {
        $scope.url = 'http://' + $location.host()
        
        var userInfo = JSON.parse(window.sessionStorage.getItem('user'))
        
        $rootScope.suspensionText = $rootScope.suspensionText || '暂停接单';
        // window.onbeforeunload = function(e) {
        //     e = e || window.event;
        //     //兼容IE8和Firefox 4 之前的版本
        //     if (e) {
        //         e.returnValue = '确定离开当前页面吗？';
        //     }else{
        //         var data = {
        //             accountNo:JSON.parse(window.sessionStorage.getItem('user')).data.userInfo.accountNo,
        //             customerId:JSON.parse(window.sessionStorage.getItem('user')).data.userInfo.customerId
        //         }
        //         httpService.linkHttp(apiUrl.closeBrowse, data)
        //     }
        //     // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        //     return '确定离开当前页面吗？';
        // };

        // window.onbeforeunload = function() {
        //     var n = window.event.screenX - window.screenLeft;
        //     var b = n > document.documentElement.scrollWidth - 20;
        //     if (b && window.event.clientY < 0 || window.event.altKey) {
        //         alert("是关闭而非刷新");
        //         window.event.returnValue = "是否关闭？";
        //         var data = {
        //             accountNo: $scope.userInfo.data.userInfo.accountNo,
        //             customerId: $scope.userInfo.data.userInfo.customerId
        //         }
        //         httpService.linkHttp(apiUrl.closeBrowse, data)
        //     } else {
        //         alert("是刷新而非关闭");
        //     }
        // }
		
		//暂停接单
		$scope.suspensionOrder = function() {
			var data = {
            	'doctorId': $rootScope.userInfo.data.userInfo.customerId,
            	'type': 1
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
		}
		
		//停止接单
		$scope.stopTrial = function(){
			
            if($state.current.url == '/triallohandle'){
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
			}else{
				
				ngDialog.open({
	                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请先完成当前处方的审核。</p></div>',
	                className: 'ngdialog-theme-default',
	                showClose: false,
	                closeByDocument: false,
	                plain: true,
	            });
	            $timeout(function(){
	            	ngDialog.close();
	            },'2000');
	           
	            if($rootScope.isStopOrder) return;
				var data = {
	                    'doctorId': $rootScope.userInfo.data.userInfo.customerId
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
			}
            
                    
			
		}
		
		
        $scope.logout = function() {
            // 确认框
            ngDialog.openConfirm({
                template: '<div>您确定退出登录</div><div class="ngdialog-buttons" style="text-align: -webkit-right;text-align: right;" >\
                	<button type="button" style="float: none;" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                    </div>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function(value) {
                httpService.linkHttp(
                    apiUrl.logout, {
                        accountNo: $rootScope.userInfo.data.userInfo.accountNo,
                        token: $rootScope.userInfo.data.tokenValue
                    }).then(function(res) {
                    if (res.data.errCode == "000000") {
                        window.sessionStorage.removeItem('user');
                        $state.go('login');
                    } else {
                        var dialog = ngDialog.open({
                            template: '<p>登出失败</p>',
                            plain: true,
                            closeByDocument: false,
                            closeByEscape: false
                        });
                        setTimeout(function() {
                            dialog.close();
                        }, 1000);
                    }
                    //关闭弹窗
                })
            }, function(reason) {
                console.log('取消');
            });
        }

        $scope.clickAlert = function(){
                    ngDialog.openConfirm({
                        template: '<div>请先停止审方</div><div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                    </div>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });
       }
    }])
    .constant("apiUrl", {
        'login': {
            'url': baseUrl + '/web/open/v1/prescription/audit/userLogin',
            'method': 'GET'
        },
        'logout': {
            'url': baseUrl + '/web/work/v1/prescription/audit/loginOut',
            'method': 'GET'
        },
        'queryExamineStarttrial': { //药师进入候诊室开始审核处方  examine/starttrial ：开始审方  按钮事件
            'url': baseUrl + '/web/work/v1/prescription/startAudit',
            'method': 'GET'
        },
        'queryTriallohandle': { //查询待审核处方   examine/triallohandle  ：刷新和后台推送信息  
            'url': baseUrl + '/web/work/v1/prescription/pendingAudit/list',
            'method': 'GET'
        },
        'queryPrescriptionDetail': { //处方详情  examine/prescriptionaudit   内容加载
            'url': baseUrl + '/web/work/v1/prescription/detail',
            'method': 'GET'
        },
        'queryPrescriptionAudit': { //审核处方  examine/prescriptionaudit   通过和不通过  点击事件
            'url': baseUrl + '/web/work/v1/prescription/audit',
            'method': 'GET'
        },
        'messagePush': { // 推送请求
            'url': baseUrl + '/app/work/v1/inquiry/messagePush',
            'method': 'GET'
        },
        'historyList': {
            'url': baseUrl + '/web/work/v1/prescription/audit/historyList',
            'method': 'GET'
        },
        'detail': {
            'url': baseUrl + '/web/work/v1/prescription/detail',
            'method': 'GET'
        },
        'stopAudit': { // 停止审方
            'url': baseUrl + '/web/work/v1/prescription/audit/stopAudit',
            'method': 'GET'
        },
        'pauseAudit': { // 暂停审方
            'url': baseUrl + '/web/work/v1/prescription/audit/pauseAudit',
            'method': 'GET'
        },
        'modifySignPassword': {
            'url': baseUrl + '/web/work/v1/prescription/audit/modifySignPassword',
            'method': 'GET'
        },
        'validateSignPassword': { // 加签密码验证
            'url': baseUrl + '/web/work/v1/prescription/audit/validateSignPassword',
            'method': 'GET'
        },
        'doctorInfoQuery': { // 药师信息查询
            'url': baseUrl + '/web/work/v1/prescription/audit/doctorInfoQuery',
            'method': 'GET'
        },
        'setSignPassword': { // 设置加签密码
            'url': baseUrl + '/web/work/v1/prescription/audit/setSignPassword',
            'method': 'GET'
        },
        'closeBrowse': {
            'url': baseUrl + '/web/work/v1/prescription/audit/closeBrowse',
            'method': 'GET'
        },
        'applicationCertificate': {		//申请证书
            'url': baseUrl + '/web/work/v1/pharmacist/applicationCertificate',
            'method': 'GET'
        },
        'addUserAgreement': {		//增加用户协议
            'url': baseUrl + '/web/work/v1/agreement/addUserAgreement',
            'method': 'POST'
        },
        'getAgreementInfo': {		//协议
            'url': baseUrl + '/web/open/v1/agreement/getAgreementInfo',
            'method': 'GET'
        }
        
    });