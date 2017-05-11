module.exports = angular.module("app.login")
    .controller("loginCtrl", ['$scope', '$state', 'httpService', '$timeout', '$rootScope', 'apiUrl', 'Md5', 'ngDialog','$interval', function($scope, $state, httpService, $timeout, $rootScope, apiUrl, Md5, ngDialog,$interval) {

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
                'passWord': Md5.hex_md5($scope.form.password+'THGDHbtzhy7lN3do')
            }
            httpService.linkHttp(apiUrl.login, data).then(function(res) {
                    // 判断请求成功
                $scope.data = res.data;
                console.log(res)
                if ($scope.data.errCode == "000000") {
                    if (!$scope.isRemember) { //记住账号
                        window.localStorage.removeItem('record')
                        window.localStorage.setItem('record', escape(window.JSON.stringify($scope.form.mobile)))
                        window.sessionStorage.setItem('user', window.JSON.stringify($scope.data))
                       
                        console.log(JSON.parse(window.sessionStorage.getItem('user')))
                    } else { //单次登录
                        window.sessionStorage.setItem('user', window.JSON.stringify($scope.data))
                       
                        if (window.localStorage.getItem('record')) {
                            window.localStorage.removeItem('record')
                        }
                    }
                    $rootScope.userInfo = JSON.parse(window.sessionStorage.getItem('user')) 
                    
                   //增加用户协议
                    var dataUA = {
						'userId': $scope.data.data.customerId,
						'agreementId': '5',
						'oprFlag': '0'
					}
					
					httpService.linkHttp(apiUrl.addUserAgreement, dataUA).then(function(resUA) {
						// 判断请求成功
						var _dataUA = resUA.data;
						console.log(_dataUA);
						if (_dataUA.errCode == "000000") {
							$state.go('examine.starttrial');
						}else{
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

                    var dialog = ngDialog.open({
                        template: '<p>' + $scope.data.errDesc + '</p>',
                        plain: true,
                        closeByDocument: false,
                        closeByEscape: false
                    });

                    setTimeout(function() {
                        dialog.close();
                    }, 1000);

                }
            });
            
            
        }

        $scope.loginClick =function(){
            switch(true){
                case $scope.form.mobile == '' || $scope.form.mobile == undefined:
                    $scope.userPro = true;
                break;
                case $scope.form.password == '' || $scope.form.password == undefined:
                    $scope.pwdPro = true;
                break;
                case $scope.isRememberXY:
                    $scope.serviceShow = true;
                break;
                default:
                    $scope.userPro = false;
                    $scope.pwdPro = false;
                    $scope.serviceShow = false;
                    $scope.login()
                break;
            }
        }


    }]).name