module.exports = angular.module("app.login")
    .controller("loginCtrl", ['$scope', '$state', 'httpService', '$timeout', '$rootScope', 'apiUrl', 'Md5', 'ngDialog', function($scope, $state, httpService, $timeout, $rootScope, apiUrl, Md5, ngDialog) {

        //切换记住密码按钮
        $scope.isRemember = true;
        $scope.isRememberXY = false;
        $scope.userPro = false;
        $scope.pwdPro = false;
        $scope.serviceShow = false;
        // $scope.kefuIs = false;
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

        //忘记密码提示语
        //$scope.kefuClick = function() {
        //  $scope.kefuIs = !$scope.kefuIs
        // };   

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
            // var userVi = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test($scope.form.mobile);
            // $scope.userPro = !userVi;
            // $scope.pwdPro = !(/\S/.test($scope.form.password));
            // if ($scope.userPro || $scope.pwdPro || $scope.isRememberXY) return;

			
			
			

            var data = {
                'userAccount': $scope.form.mobile,
                'password': Md5.hex_md5($scope.form.password+'THGDHbtzhy7lN3do')
            }
            httpService.linkHttp(apiUrl.login, data).then(function(res) {
                    // 判断请求成功
                $scope.data = res.data;
                if ($scope.data.errCode == "000000") {
                    if (!$scope.isRemember) { //记住账号
                        window.localStorage.removeItem('record')
                        window.localStorage.setItem('record', escape(window.JSON.stringify($scope.form.mobile)))
                        window.sessionStorage.setItem('user', window.JSON.stringify($scope.data))
                            // $state.go('examine')
                        console.log(JSON.parse(window.sessionStorage.getItem('user')))
                    } else { //单次登录
                        window.sessionStorage.setItem('user', window.JSON.stringify($scope.data))
                       
                        // $state.go('examine')
                        if (window.localStorage.getItem('record')) {
                            window.localStorage.removeItem('record')
                        }
                    }
                   //$state.go('examine.starttrial');
                    
                   //var url2 = 'http://192.168.1.31:8207/web/inner/v1/agreement/addUserAgreement?userId=325567434257&agreementId=1&oprFlag=0' 
                   //增加用户协议
                    var dataUA = {
						'userId': $scope.data.data.userInfo.customerId,
						'agreementId': '1',
						'oprFlag': '0'
					}
					
					httpService.linkHttp(apiUrl.addUserAgreement, dataUA).then(function(resUA) {
						// 判断请求成功
						var _dataUA = resUA.data;
						console.log(resUA);
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
                	if($scope.data.errDesc == null){
                		$scope.data.errDesc = '请求出现错误，请稍后重试。';
                	}

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
            console.log($scope.isRememberXY)
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