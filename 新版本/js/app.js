'use strict';
var baseUrl = 'http://dev-admin.siruijk.com:8207'
require('../css/style.css');
require('../css/common.css');
require('../lib/ngDialog/css/ngDialog-custom-width.css')
require('../lib/ngDialog/css/ngDialog-theme-default.css')
require('../lib/ngDialog/css/ngDialog-theme-plain.css')
require('../lib/ngDialog/css/ngDialog.css')
require('../lib/ngDialog/ngDialog.js')
require('../lib/md5.js')
var app = angular.module('app',[
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
    .run(function($rootScope,$state,ngDialog){

        //动态改变title
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {  
        	ngDialog.close();
            $rootScope.title = toState.title
            $rootScope.isHead = toState.isHead
            var body = document.getElementsByTagName('body')[0];  
            document.title = toState.title; 
            console.log(toState)
        }); 

        //视图渲染前
        $rootScope.$on('$viewContentLoading', function(event, viewConfig){ 
           $rootScope.loader = true;
        });

        //视图渲染后
        $rootScope.$on('$viewContentLoaded', function(event, viewConfig){ 
           $rootScope.loader = false;
        });

    })
    
    .config(['$httpProvider','$urlRouterProvider','$locationProvider',function($httpProvider,$urlRouterProvider,$locationProvider){
        $urlRouterProvider.otherwise("/login");
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data)
        {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj)
            {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for(name in obj)
                {
                    value = obj[name];
                    if(value instanceof Array)
                    {
                        for(i=0; i<value.length; ++i)
                        {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value instanceof Object)
                    {
                        for(subName in value)
                        {
                            subValue = value[subName];
                            if(subValue != null){
                                // fullSubName = name + '[' + subName + ']';
                                //user.userName = hmm & user.userPassword = 111
                                fullSubName = name + '.' + subName;
                                // fullSubName =  subName;
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        }
                    }
                    else if(value !== undefined ) //&& value !== null
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
    .controller("mainCtrl", ['$scope','$state','$rootScope','$location','Md5', function($scope,$state,$rootScope,$location,Md5) {
        console.log('启动控制器')
        $scope.url = 'http://'+ $location.host()
        window.onbeforeunload = function (e) {
          e = e || window.event;

          // // 兼容IE8和Firefox 4之前的版本
          // if (e) {
          //   e.returnValue = '关闭提示';
          // }

          // // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          // return '关闭提示';
        };

        
        console.log(Md5.hex_md5('123456'))
        console.log(Md5.hex_md5('654321'))
    }])
    .constant("apiUrl", {
        'login':{
            'url':baseUrl + '/app/open/v1/login'
        },
        'queryExamineStarttrial':{		//药师进入候诊室开始审核处方  examine/starttrial ：开始审方  按钮事件
            'url':baseUrl + '/web/inner/v1/prescription/startAudit',
            'method':'GET'
        },
        'queryTriallohandle':{		//查询待审核处方   examine/triallohandle  ：刷新和后台推送信息  
            'url':baseUrl + '/web/inner/v1/prescription/pendingAudit/list',
            'method':'GET'
        },
        'queryPrescriptionDetail':{		//处方详情  examine/prescriptionaudit   内容加载
            'url':baseUrl + '/web/inner/v1/prescription/detail',
            'method':'GET'
        },
        'queryPrescriptionAudit':{		//审核处方  examine/prescriptionaudit   通过和不通过  点击事件
            'url':baseUrl + '/web/inner/v1/prescription/audit',
            'method':'GET'
        },
        'messagePush':{                // 推送请求
            'url':baseUrl + '/app/inner/v1/inquiry/messagePush',
            'method':'GET'
        },
        'historyList':{
            'url': baseUrl + '/web/inner/v1/prescription/audit/historyList',
            'method':'GET'
        },
        'detail':{
            'url': baseUrl + '/web/inner/v1/prescription/detail',
            'method':'GET'
        },
        'stopAudit':{                // 停止审方
            'url':baseUrl + '/web/inner/v1/prescription/audit/stopAudit',
            'method':'GET'
        },
        'modifySignPassword':{
            'url':baseUrl + '/web/inner/v1/prescription/audit/modifySignPassword',
            'method':'GET'
        },
        'validateSignPassword':{                // 加签密码验证
            'url':baseUrl + '/web/inner/v1/prescription/audit/validateSignPassword',
            'method':'GET'
        },
        'doctorInfoQuery':{                // 药师信息查询
            'url':baseUrl + '/web/inner/v1/prescription/audit/doctorInfoQuery',
            'method':'GET'
        },
        'setSignPassword':{                // 设置加签密码
            'url':baseUrl + '/web/inner/v1/prescription/audit/setSignPassword',
            'method':'GET'
        }
    });
