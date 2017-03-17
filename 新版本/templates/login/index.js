module.exports = angular.module("app.login")
    .controller("loginCtrl", ['$scope', '$state', 'httpService', '$timeout','$rootScope','apiUrl', function($scope, $state, httpService, $timeout,$rootScope,apiUrl) {
          
            //切换记住密码按钮
            $scope.isRemember = true;
            $scope.isRememberXY = false;
            $scope.userPro = false;
            $scope.pwdPro = false;
           // $scope.kefuIs = false;
            $scope.form = {
                'mobile': '',
                'password': ''
            }

             $scope.myKeyup = function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.login()
                }
            };
            
            //忘记密码提示语
			//$scope.kefuClick = function() {
			//	$scope.kefuIs = !$scope.kefuIs
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
			     console.log(window.localStorage.getItem('record'));
			     //有本地取本地
            if (window.localStorage.getItem('record')) {
                var record = JSON.parse(unescape(window.localStorage.getItem('record')))
                console.log(record);
                $scope.isRemember = true;
                $scope.form = {
                    'mobile': record.mobile,
                    'password': record.password
                }
            }


            $scope.login = function() {
            	var userVi = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test($scope.form.mobile);
            	$scope.userPro = !userVi;
            	$scope.pwdPro = !(/\S/.test($scope.form.password));
            	if($scope.userPro || $scope.pwdPro ||$scope.isRememberXY) return;
            	var data = {
                    'mobileNo':'217979635127',
                    'validationType':2,
              }


            	// httpService.linkHttp(apiUrl.login,data).then(function(res) {
             //            console.log(res)
             //            // 判断请求成功
             //            var data = res.data;
             //            $scope.data = data.data
             //            console.log(data);
             //            if (data.errCode == "000000") {
             //                var data = data.data;
             //            }
                        
             //            if ($scope.isRemember) { //记住密码
             //                window.localStorage.setItem('record', escape(window.JSON.stringify($scope.form)))
             //                window.sessionStorage.setItem('user', window.JSON.stringify($scope.data))
             //                // $state.go('examine')
             //            } else { //单次登录
             //                window.sessionStorage.setItem('user', window.JSON.stringify($scope.data))
             //                // $state.go('examine')
             //                if (window.localStorage.getItem('record')) {
             //                    window.localStorage.removeItem('record')
             //                }
             //            }
                        
             //        });
             
             
                $state.go('examine');
                //$state.go('examine.starttrial');
                //$state.go('starttrial');
                
            }

        }]).name
