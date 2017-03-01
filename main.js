require('./resource/css/bootstrap.css');
require('./resource/css/main.css');
require('./resource/css/common.css');
define([
    './modules/patient/namespace',
    './modules/prescription/namespace',
    './modules/interrogation/namespace',//处方模块
    './component/directives/namespace',
    './component/services/namespace',
    './component/filters/filters'
], function() {
    'use strict';
    return angular.module('app', ['ui.router', 'app.patient', 'app.prescription','app.interrogation', 'app.directives', 'app.services', 'app.filters'])
        .run([function() {

        }])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider
                .state('login', {
                    url: '/login',
                    title: '登录',
                    templateUrl: 'login.html',
                    controller:'Login'
                })
                .state('main', {
                    url: '/main',
                    templateUrl: 'main.html' + '?datestamp=' + (new Date()).getTime(),
                    controller: 'mainCtrl'
                })

                .state('main.patientList', {
                    url: '/patientList',
                    templateUrl: 'patient.html' + '?datestamp=' + (new Date()).getTime(),
                    controller: 'patientCtrl'
                })

                .state('main.patientDetail', {
                    url: '/patientDetail/:Id',
                    templateUrl: 'patientDetail.html' + '?datestamp=' + (new Date()).getTime(),
                    controller: 'patientDetailCtrl'
                })

                .state('main.patientRegister', {
                    url: '/register/:Id',
                    templateUrl: 'registerInfo.html' + '?datestamp=' + (new Date()).getTime(),
                    controller: 'patientRegisterCtrl'
                })

                .state('main.patientInquiry', {
                    url: '/inquiry/:Id',
                    templateUrl: 'inquiryInfo.html' + '?datestamp=' + (new Date()).getTime(),
                    controller: 'patientInquiryCtrl'
                })

                .state('prescription', {
                    url: '/prescription',
                    templateUrl: 'prescription.html' + '?datestamp=' + (new Date()).getTime(),
                    controller: 'prescriptionCtrl'
                })

                .state('main.interrogation', {
                    url: '/interrogation',
                    title:'处方列表',
                    templateUrl: 'interrogationList.html',
                    controller: 'interrogationListCtrl'
                })

                .state('main.interrogationDetails', {
                    url: '/Interrogation/details/:id',
                    title:'处方详情',
                    templateUrl: 'interrogationDetails.html',
                    controller: 'interrogationDetailsCtrl'
                })

                .state('main.interrogationPrint', {
                    url: '/Interrogation/Print/:id',
                    title:'查看处方',
                    templateUrl: 'prescription.html',
                    controller: 'interrogationPrintCtrl'
                })

        })

        .controller('mainCtrl', ['$scope', '$state', function($scope, $state) {
                $scope.fold = false;
                $scope.toggleFold = function() {
                    $scope.fold = !$scope.fold;
                }

                $scope.menuList = [{
                    "createDate": "2017-02-09 19:23:39",
                    "createId": "0",
                    "displayOrder": "1",
                    "id": "1",
                    "menuDesc": "用户管理模块",
                    "menuIcon": "",
                    "menuName": "用户管理",
                    "menuUrl": "",
                    "pid": "0",
                    "routeType": "0",
                    "status": "N",
                    "updateDate": "2017-02-09 19:23:39",
                    "updateId": "0",
                    "childNode": [{
                        "createDate": "2017-02-09 19:23:39",
                        "createId": "0",
                        "displayOrder": "2",
                        "id": "5",
                        "menuDesc": "用户列表一级菜单",
                        "menuIcon": "",
                        "menuName": "用户列表",
                        "menuUrl": "main.patientList",
                        "pid": "1",
                        "routeType": "0",
                        "status": "N",
                        "updateDate": "2017-02-09 19:23:39",
                        "updateId": "0",
                        "childNode": []
                    }]
                }, {
                    "createDate": "2017-02-09 19:23:39",
                    "createId": "0",
                    "displayOrder": "3",
                    "id": "1",
                    "menuDesc": "处方管理模块",
                    "menuIcon": "",
                    "menuName": "处方管理",
                    "menuUrl": "",
                    "pid": "0",
                    "routeType": "0",
                    "status": "N",
                    "updateDate": "2017-02-09 19:23:39",
                    "updateId": "0",
                    "childNode": [{
                        "createDate": "2017-02-09 19:23:39",
                        "createId": "0",
                        "displayOrder": "2",
                        "id": "5",
                        "menuDesc": "处方列表一级菜单",
                        "menuIcon": "",
                        "menuName": "处方列表",
                        "menuUrl": "main.interrogation",
                        "pid": "1",
                        "routeType": "0",
                        "status": "N",
                        "updateDate": "2017-02-09 19:23:39",
                        "updateId": "0",
                        "childNode": []
                    }]
                }];
            }])
        .controller('Login', ['$scope', '$state', function($scope, $state) {
            //切换记住密码按钮
            $scope.isRemember=false;
            $scope.toggleRemember=function(){
                $scope.isRemember=!$scope.isRemember;
            };
            $scope.login = function () {
                $state.go('main.patientList');
            }
        }])
});
