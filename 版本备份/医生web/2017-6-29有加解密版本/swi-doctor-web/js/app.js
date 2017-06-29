'use strict';
//var baseUrl = 'http://dev-admin.siruijk.com:8006'
    var baseUrl = 'http://dev-admin.siruijk.com:8081'
    // var baseUrl = 'http://test-admin.siruijk.com:8083'
    //var baseUrl = 'http://dev2-app.siruijk.com:8081'
require('../css/style.css')
require('../css/common.css')
require('../css/fonts.css')
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
            $rootScope.isStopOrder = false;
            $rootScope.stopTime = false;
            $rootScope.timeCount = $rootScope.timeCount || 0;
            ngDialog.close();
            if (!window.sessionStorage.getItem('DRWEB_user')) {
                if ($state.current.url != '/agreement') {
                    $state.go('login')
                }
            } else {
                $rootScope.userInfo = JSON.parse(window.sessionStorage.getItem('DRWEB_user'))
                console.log($rootScope.userInfo)
            }
            $rootScope.title = toState.title
            $rootScope.isHead = toState.isHead
            $rootScope.headClick = toState.headClick != undefined ? toState.headClick : true
                // var body = document.getElementsByTagName('body')[0];
                // document.title = toState.title;
                // console.log(toState)
                // if (toState.url == '/login' && window.sessionStorage.getItem('DRWEB_user')) {
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
.controller("mainCtrl", ['$scope', '$state', '$rootScope', '$timeout', '$location', 'Md5', 'apiUrl', 'ngDialog', 'httpService', function($scope, $state, $rootScope, $timeout, $location, Md5, apiUrl, ngDialog, httpService) {
        $scope.url = 'http://' + $location.host()
        var userInfo = JSON.parse(window.sessionStorage.getItem('DRWEB_user'))
		/*$rootScope.userInfo	= {
			'data':{
				'doctorName':'李三峰',
				'yiyuanName':'乌鲁木齐第几人民医院'
			}
		}*/
		$rootScope.userInfo = userInfo
		
		
		
        // window.onbeforeunload = function(e) {
        //     e = e || window.event;
        //     //兼容IE8和Firefox 4 之前的版本
        //     if (e) {
        //         e.returnValue = '确定离开当前页面吗？';
        //     }else{
        //         var data = {
        //             accountNo:JSON.parse(window.sessionStorage.getItem('DRWEB_user')).data.userInfo.accountNo,
        //             customerId:JSON.parse(window.sessionStorage.getItem('DRWEB_user')).data.userInfo.customerId
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
                'doctorId': $rootScope.userInfo.data.customerId
            }
            httpService.linkHttp(apiUrl.pauseAudit, data).then(function(res) {
                // 判断请求成功
                var rsdata = res.data;
                if (rsdata.errCode == "000000") {
                    //$state.go('examine.starttrial');
                }
            });
        }

        //停止接单
        $scope.stopTrial = function() {

            if ($state.current.url == '/triallohandle' || $state.current.url == '/todayHistory') {
                var data = {
                    'doctorId': $rootScope.userInfo.data.customerId
                }
                httpService.linkHttp(apiUrl.quitInquiry, data).then(function(res) {
                    // 判断请求成功
                    var rsdata = res.data;
                    if (rsdata.errCode == "000000") {
                        $state.go('examine.starttrial');
                    }
                });
            } else {

                ngDialog.open({
                    template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >请先完成当前处方的审核。</p></div>',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    closeByDocument: false,
                    plain: true,
                });
                $timeout(function() {
                    ngDialog.close();
                }, '2000');

                if ($rootScope.isStopOrder) return;
                var data = {
                    'doctorId': $rootScope.userInfo.data.customerId
                }
                httpService.linkHttp(apiUrl.stopAudit, data).then(function(res) {
                    // 判断请求成功
                    var rsdata = res.data;
                    if (rsdata.errCode == "000000") {
                        //$state.go('examine.starttrial');
                        $rootScope.isStopOrder = true;
                    }

                });
            }



        }

        $scope.clickAlert = function() {
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
        'login': { //登录
            'url': baseUrl + '/app/open/v1/login',
            'method': 'POST'
        },
        'loginOut': { //退出登录
            'url': baseUrl + '/app/inner/v1/loginOut',
            'method': 'POST'
        },
        'addUserAgreement': { //增加用户协议
            'url': baseUrl + '/app/inner/v1/agreement/addUserAgreement',
            'method': 'POST'
        },
        'getAgreementInfo': { //获取最新协议版本
            'url': baseUrl + '/app/open/v1/agreement/getAgreementInfo',
            'method': 'GET'
        },
        'startInquiry': { //医生进入候诊室开始接诊
            'url': baseUrl + '/app/inner/v1/inquiry/startInquiry',
            'method': 'GET'
        },
        'queueList': { //排队列表
            'url': baseUrl + '/app/inner/v1/inquiry/doctor/queueList',
            'method': 'GET'
        },
        'queueListNoLoad': { //排队列表无加载动画
            'url': baseUrl + '/app/inner/v1/inquiry/doctor/queueList',
            'method': 'GET',
            'loader':false
        },
        'pauseInquiry': { //医生暂停接单
            'url': baseUrl + '/app/inner/v1/inquiry/pauseInquiry',
            'method': 'GET'
        },
        'quitInquiry': { //医生退出候诊室
            'url': baseUrl + '/app/inner/v1/inquiry/quitInquiry',
            'method': 'GET'
        },
        'sumRecord': { //问诊记录数
            'url': baseUrl + '/app/inner/v1/inquiry/sumRecord',
            'method': 'GET'
        },
        'detail': { //问诊详情
            'url': baseUrl + '/app/inner/v1/inquiry/detail',
            'method': 'GET'
        },
        'start': { //接诊
            'url': baseUrl + '/app/inner/v1/inquiry/start',
            'method': 'GET'
        },
        'over': { //完成问诊
            'url': baseUrl + '/app/inner/v1/inquiry/over',
            'method': 'POST',
            'isErrMsg':false
        },
        'getDiseaseInfo': { //疾病查询接口
            'url': baseUrl + '/app/inner/v1/diseaseLib/getDiseaseInfo',
            'method': 'GET'
        },
        'drugList': { //药品查询接口
            'url': baseUrl + '/app/inner/v1/inquiry/drugList',
            'method': 'POST'
        },
        'caseEdit': { //修改病例
            'url': baseUrl + '/app/inner/v1/case/edit',
            'method': 'POST'
        },
        'caseList': { //病例列表
            'url': baseUrl + '/app/inner/v1/case/list',
            'method': 'GET'
        },
        'doctorDetail': { //医生基本信息查询
            'url': baseUrl + '/app/inner/v1/doctor/detail',
            'method': 'GET'
        },
        'doctorEdit': { //基本信息修改
            'url': baseUrl + '/app/inner/v1/doctor/detail/edit',
            'method': 'GET'
        },
        'doctorInquirylist': { //问诊记录
            'url': baseUrl + '/app/inner/v1/inquiry/list',
            'method': 'GET'
        },
        'submit': { //处方提交审核
            'url': baseUrl + '/app/inner/v1/prescription/audit/submit',
            'method': 'GET',
            'isErrMsg':false
        },
        'prescriptionDetail': { //处方详情
            'url': baseUrl + '/app/inner/v1/prescription/detail',
            'method': 'GET'
        },
        'applicationCertificate': { //申请加签密码
            'url': baseUrl + '/app/inner/v1/doctor/applicationCertificate',
            'method': 'GET'
        },
        'queueNumber': { //查询医生待接诊订单数量
            'url': baseUrl + '/app/inner/v1/doctor/queueNumber',
            'method': 'GET'
        },
        'validatePassword': { //验证加签密码
            'url': baseUrl + '/app/inner/v1/doctor/validatePassword',
            'method': 'POST',
            'isErrMsg':false
        },
        'modifyPassword': { //修改加签密码
            'url': baseUrl + '/app/inner/v1/doctor/modifyPassword',
            'method': 'POST'
        },
        'send': {
            'url': baseUrl + '/app/open/v1/sms/send2',
            'method': 'POST'
        },
        'check': {
            'url': baseUrl + '/app/open/v1/sms/check',
            'method': 'GET',
            'isErrMsg':false
        },
        'queryCaseDetail': {     //开始问诊
            'url': baseUrl + '/app/inner/v1/doctor/queryCaseDetail',
            'method':'POST'
        },
        'resetPassword':{
            'url': baseUrl + '/app/inner/v1/doctor/resetPassword',
            'method':'POST'

        },
        'updateUserInfo': {     
            'url': baseUrl + '/app/openService/updateUserInfo',
            'method':'POST'
        },
        'serviceValueList': {     //查询数据字典接口
            'url': baseUrl + '/app/open/common/serviceValue/list',
            'method':'GET',
            'isErrMsg':false
        },
        'resetSignPassword': {     //重置加签密码
            'url': baseUrl + '/app/inner/v1/doctor/resetSignPassword',
            'method':'GET'
        },
        'send2': {     //重置加签密码发送手机验证码
            'url': baseUrl + '/app/open/v1/sms/send2',
            'method': 'POST',
            'isErrMsg':false
        },
        'sign': {     //处方加签
            'url': baseUrl + '/app/inner/v1/doctor/sign',
            'method': 'POST',
            'isErrMsg':false
        },
        'cancel': {     //取消问诊
            'url': baseUrl + '/app/inner/v1/order/cancel',
            'method': 'GET'
        },
        'orderStatus': {     //查询问诊单状态
            'url': baseUrl + '/app/inner/v1/order/status',
            'method': 'GET',
            'isErrMsg':false,
            'loader':false
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