'use strict';
var baseUrl = 'http://dev-admin.siruijk.com:8001'
//var baseUrl2 = 'http://dev-admin.siruijk.com:8082'
 //var baseUrl = 'http://admin1.siruijk.com:8081'
 //var baseUrl = 'http://uat-yun.siruijk.com:8081'
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
    .run(function($rootScope, $state, ngDialog,httpService,apiUrl) {

        //动态改变title
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        	$rootScope.isStopOrder =  false;
            ngDialog.close();
            $rootScope.userInfo = JSON.parse(window.sessionStorage.getItem('user'))
        	if(!$rootScope.userInfo){
                $state.go('login')
            }
        	/*$rootScope.userInfo	= {
					'doctorId':'12121',
					'doctorName':'李三峰',
					'yiyuanName':'乌鲁木齐第几人民医院'
				
			}*/
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

        $rootScope.getSecretKey = function(){
            httpService.linkHttp(apiUrl.getPublicKeys)
            .then(function(res) {
                /**
                 *@public1 //json串加密
                 *@public2 //敏感字段加密
                 **/
                window.sessionStorage.setItem('public', JSON.stringify(res.data.data))
                $rootScope.Public = res.data.data
            })
            httpService.linkHttp(apiUrl.getPrivateKeys)
            .then(function(res) {
                /**
                 *@publicKey1 //json串解密
                 *@publicKey2 //敏感字段解密
                 **/
                window.sessionStorage.setItem('private', JSON.stringify(res.data.data))
                $rootScope.Private = res.data.data
            })
        }
        $rootScope.getSecretKey()


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
		
		$scope.stopTrial = function(){
			
            if($state.current.url == '/triallohandle'){
					var data = {
                    'doctorId': $rootScope.userInfo.doctorId
	            }
	        	httpService.linkHttp(apiUrl.quitInquiry,data).then(function(res) {
	                // 判断请求成功
	                var rsdata = res.data;
	                console.log(rsdata);
	                if (rsdata.errCode == "000000") {
	                	$state.go('examine.starttrial');
	                }else{
	                	//$state.go('examine.starttrial');
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
	                    'doctorId': $rootScope.userInfo.doctorId
	            }
	        	httpService.linkHttp(apiUrl.quitInquiry,data).then(function(res) {
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
                template: '<div style="    text-align: -webkit-center;text-align: center;padding-top:50px;padding-bottom:50px;">你确定要退出当前账号？</div><div class="ngdialog-buttons" >\
                    <button type="button" style="float: none;width: 160px;height: 40px;" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                    <button type="button" style="width: 160px;height: 40px;" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                	</div>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function(value) {
                httpService.linkHttp(
                    apiUrl.loginOut, {
                    	'mobileNo':$rootScope.userInfo.mobileNo
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
            'url': baseUrl + '/web/open/v1/remotePrescription/login',
            'method': 'POST'
        },
        'loginOut': {
            'url': baseUrl + '/web/inner/v1/remotePrescription/loginOut',
            'method': 'POST'
        },
        'aduit': {			//审核处方
            'url': baseUrl + '/web/inner/v1/remotePrescription/aduit',
            'method': 'POST',
            'isErrMsg':false
        },
        'certificate': {			//获取证书
            'url': baseUrl + '/web/inner/v1/enterprisePharmacist/certificate',
            'method': 'POST'
        },
        'applicationCertificate': {			//申请证书包含设置加签密码
            'url': baseUrl + '/web/inner/v1/enterprisePharmacist/applicationCertificate',
            'method': 'POST'
        },
        'startInquiry': {			//进入候诊室
            'url': baseUrl + '/web/inner/v1/remotePrescription/startInquiry',
            'method': 'POST'
        },
        'quitInquiry': {			//退出候诊室
            'url': baseUrl + '/web/inner/v1/remotePrescription/quitInquiry',
            'method': 'POST'
        },
        'list': {			//查询待审核处方
            'url': baseUrl + '/web/inner/v1/remotePrescription/pendingAudit/list',
            'method': 'POST'
        },
        'listNoLoad': {			//查询待审核处方
            'url': baseUrl + '/web/inner/v1/remotePrescription/pendingAudit/list',
            'method': 'POST',
            'loader':false
        },
        'detail': {			//处方详情
            'url': baseUrl + '/web/inner/v1/remotePrescription/detail',
            'method': 'POST',
            'isErrMsg':false
        },
        'historyList': {			//审核历史
            'url': baseUrl + '/web/inner/v1/remotePrescription/historyList',
            'method': 'POST'
        },
        'detailAfter': {			//审核历史详情
            'url': baseUrl + '/web/inner/v1/remotePrescription/detailAfter',
            'method': 'POST'
        },
        'modifySignPassword': {			//修改加签密码
            'url': baseUrl + '/web/inner/v1/remotePrescription/audit/modifySignPassword',
            'method': 'POST'
        },
        'verificationCode': {			//短信码校验 
            'url': baseUrl + '/app/open/v1/sms/check',
            'method': 'POST'
        },
        'getVerificationCode': {			//发送短信验证码
            'url': baseUrl + '/app/open/v1/sms/send2',
            'method': 'POST'
        },
        'validateSignPassword': {			//加签密码验证
            'url': baseUrl + '/web/inner/v1/remotePrescription/audit/validateSignPassword',
            'method': 'POST',
            'isErrMsg':false
        },
        'resetSignPassword': {			//重置加签密码
            'url': baseUrl + '/web/inner/v1/remotePrescription/audit/resetSignPassword',
            'method': 'POST'
        },
        "getPublicKeys": {
            "url": baseUrl + '/platform/getPublicKeys',
            "exclude":false
        },
        "getPrivateKeys":{
            "url": baseUrl + '/platform/getPrivateKeys',
            "exclude":false
        }
        
        
    });