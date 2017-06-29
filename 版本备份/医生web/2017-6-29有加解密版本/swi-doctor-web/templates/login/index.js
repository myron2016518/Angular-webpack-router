module.exports = angular.module("app.login")
    .controller("loginCtrl", ['$scope', '$state', 'httpService', '$timeout', '$rootScope', 'apiUrl', 'Md5', 'ngDialog', '$interval', function($scope, $state, httpService, $timeout, $rootScope, apiUrl, Md5, ngDialog, $interval) {

        //切换记住密码按钮
        $scope.isRemember = true;
        $scope.isRememberXY = false;
        $scope.userPro = false;
        $scope.pwdPro = false;
        $scope.serviceShow = false;
        $scope.form = {
            'mobile': '',
            'password': ''
        }

        $scope.dynamic = {
            'mobileCode': '',
            'mobile': ''
        }

        $scope.switch = 'mobile'

        $scope.myKeyup = function(e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.login()
            }
        };

        $scope.toggleRemember = function() {
            $scope.isRemember = !$scope.isRemember;
        };
        $scope.toggleRememberXY = function() {
            $scope.isRememberXY = !$scope.isRememberXY;
        };
        //弹窗
        $scope.alert = function(text) {
                $scope.isAlert = true;
                $scope.alertText = text;
                $timeout(function() {
                    $scope.isAlert = false;
                }, 1000)
            }
            //有本地取本地
        if (window.localStorage.getItem('record')) {
            var record = JSON.parse(unescape(window.localStorage.getItem('record')))
            $scope.isRemember = false;
            $scope.form = {
                'mobile': record
            }
        }

        $scope.login = function() {

            var data = {
                'mobileNo': $scope.form.mobile,
                'validationType': '1',
                'clientType': '5',
                'passWord': Md5.hex_md5($scope.form.password + 'THGDHbtzhy7lN3do')
            }

            httpService.linkHttp(apiUrl.login, data).then(function(res) {
                // 判断请求成功
                $scope.data = res.data;
                if ($scope.data.errCode == "000000") {
                    if (!$scope.isRemember) { //记住账号
                        window.localStorage.removeItem('record')
                        window.localStorage.setItem('record', escape(window.JSON.stringify($scope.form.mobile)))
                        window.sessionStorage.setItem('DRWEB_user', window.JSON.stringify($scope.data))

                        console.log(JSON.parse(window.sessionStorage.getItem('DRWEB_user')))
                    } else { //单次登录
                        window.sessionStorage.setItem('DRWEB_user', window.JSON.stringify($scope.data))

                        if (window.localStorage.getItem('record')) {
                            window.localStorage.removeItem('record')
                        }
                    }
                    $rootScope.userInfo = JSON.parse(window.sessionStorage.getItem('DRWEB_user'))
 					//$state.go('examine.starttrial');
                    //增加用户协议
                    var dataUA = {
                        'userId': $scope.data.data.customerId,
                        'agreementId': '5',
                        'oprFlag': '0'
                    }

                    httpService.linkHttp(apiUrl.addUserAgreement, dataUA).then(function(resUA) {
                        // 判断请求成功
                        var _dataUA = resUA.data;
                        if (_dataUA.errCode == "000000") {
                            $state.go('examine.starttrial');
                        } else {
                            var dialog = ngDialog.open({
                                template: '<p>' + _dataUA.errDesc + '</p>',
                                plain: true,
                                closeByDocument: false,
                                closeByEscape: false
                            });

                            setTimeout(function() {
                                dialog.close();
                            }, 1000);
                        }
                    });


                } else {

                    /* var dialog = ngDialog.open({
                         template: '<p>' + $scope.data.errDesc + '</p>',
                         plain: true,
                         closeByDocument: false,
                         closeByEscape: false
                     });

                     setTimeout(function() {
                         dialog.close();
                     }, 1000);*/

                }
            });


        }

        $scope.checkLogin = function() {

            var data = {
                'mobileNo': $scope.dynamic.mobile,
                'validationType': '0',
                'clientType': '5',
                'smsCode': $scope.dynamic.mobileCode
            }

            httpService.linkHttp(apiUrl.login, data).then(function(res) {
                // 判断请求成功
                $scope.data = res.data;
                if ($scope.data.errCode == "000000") {
                    window.sessionStorage.setItem('DRWEB_user', window.JSON.stringify($scope.data))

                    $rootScope.userInfo = JSON.parse(window.sessionStorage.getItem('DRWEB_user'))

                    //增加用户协议
                    var dataUA = {
                        'userId': $scope.data.data.customerId,
                        'agreementId': '5',
                        'oprFlag': '0'
                    }
                    $scope.dynamic = {
                        'mobileCode': '',
                        'mobile': ''
                    }
                    httpService.linkHttp(apiUrl.addUserAgreement, dataUA).then(function(resUA) {
                        // 判断请求成功
                        var _dataUA = resUA.data;
                        if (_dataUA.errCode == "000000") {
                            $state.go('examine.starttrial');
                        } else {
                            var dialog = ngDialog.open({
                                template: '<p>' + _dataUA.errDesc + '</p>',
                                plain: true,
                                closeByDocument: false,
                                closeByEscape: false
                            });

                            setTimeout(function() {
                                dialog.close();
                            }, 1000);
                        }
                    });


                } else {

                    /* var dialog = ngDialog.open({
                         template: '<p>' + $scope.data.errDesc + '</p>',
                         plain: true,
                         closeByDocument: false,
                         closeByEscape: false
                     });

                     setTimeout(function() {
                         dialog.close();
                     }, 1000);*/

                }
            })

        }

        $scope.loginClick = function() { //提交事件
            if ($scope.switch == 'password') {
                switch (true) {
                    case $scope.form.mobile == '' || $scope.form.mobile == undefined:
                        $scope.userPro1 = true;
                        $scope.proText1 = '用户名或手机号错误';
                        break;
                    case $scope.form.password == '' || $scope.form.password == undefined:
                        //$scope.pwdPro = true;
                        $scope.userPro1 = true;
                        $scope.proText1 = '密码出错';
                        break;
                    case $scope.isRememberXY:
                        //$scope.serviceShow = true;
                        $scope.userPro1 = true;
                        $scope.proText1 = '必须同意服务协议才能登录';
                        break;
                    default:
                        $scope.userPro1 = false;
                        //$scope.pwdPro = false;
                        //$scope.serviceShow = false;
                        $scope.login()
                        break;
                }
            } else if ($scope.switch == 'mobile') {
                switch (true) {
                    case $scope.dynamic.mobile == '' || $scope.dynamic.mobile == undefined:
                        $scope.userPro = true;
                        $scope.proText = '手机号错误';
                        break;
                    case $scope.dynamic.mobileCode == '' || $scope.dynamic.mobileCode == undefined:
                        $scope.userPro = true;
                        $scope.proText = '验证码出错';

                        break;
                    case $scope.isRememberXY:
                        //$scope.serviceShow = true;
                        $scope.userPro = true;
                        $scope.proText = '必须同意服务协议才能登录';
                        break;
                    default:
                        $scope.userPro = false;
                        //$scope.pwdPro = false;
                        //$scope.serviceShow = false;
                        $scope.checkLogin()
                        break;
                }
            }

        }

        $scope.timer = {
            data: '获取验证码',
            kedian: false,
            time: 120
        }

        $scope.change = function() {
            if (!$scope.dynamic.mobile && !$scope.dynamic.mobile.length == '11') {
                ngDialog.open({
                    template: '<p>请输入手机号码</p>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
            } else if (!$scope.timer.kedian) {
                httpService.linkHttp(apiUrl.send, {
                        'mobileNo': $scope.dynamic.mobile,
                        'type': 5
                    })
                    .then(function(res) {
                        // console.log(res)
                        if (res.data.errCode == '000000') {
                            $scope.timer.kedian = true;
                            $interval(function() {
                                $scope.timer.time--;
                                $scope.timer.data = '获取验证码(' + $scope.timer.time + ')';
                                if ($scope.timer.time == 0) {
                                    $scope.timer.kedian = false;
                                    $scope.timer.time = 120
                                    $scope.timer.data = '重新获取验证码'
                                    $scope.dynamic.mobileCode = ''
                                }
                            }, 1000, $scope.timer.time)
                        }
                    })

            }
        }

        $scope.tabSwitch = function(data) {
            $scope.switch = data
        }

    }]).name