module.exports = angular.module("app.user")
	.controller("userCtrl", ['$scope', '$rootScope', '$state', 'httpService', '$stateParams', 'apiUrl', '$location', '$timeout', 'Md5', 'ngDialog','$interval',
		function($scope, $rootScope, $state, httpService, $stateParams, apiUrl, $location, $timeout, Md5, ngDialog,$interval) {
			$location.search('type', 'number')

			$scope.isHide = 'number'

			$scope.isPage = function(data) {
				$location.search('type', data)
				$scope.isHide = $location.search().type
			}

			$scope.modify = false;

			var reg1 = /^(\w){6,16}$/;
			var reg = /^[0-9]*$/;
			// var reg = new RegExp('^\d{6,}$')

			$scope.autographWarn = ''
			$scope.numberWarn = ''
			$scope.mobileNo = ''	//手机号码
			$scope.send = ''	//验证码
			$scope.number = { //修改账号密码
				'oldPassword': '', //旧密码
				'newPassword': '', //新密码
				'cmNewPassword': '' //确认新密码
			}

			$scope.numberIs = { 
				'oldPassword': false, //旧密码
				'newPassword': false, //新密码
				'cmNewPassword': false //确认新密码
			}

			$scope.nextClick = function() {
				httpService.linkHttp(apiUrl.check, {
						'mobileNo': $scope.mobileNo,
						'type': 7,
						'smsCode': $scope.send
					})
					.then(function(res) {
						if (res.data.errCode == '000000') {
							$scope.modify = true;
						}
					})
			}

			$scope.timer = {
                data:'获取验证码',
                kedian:false,
                time:120
            }


            $scope.change = function(){
            	if(!$scope.mobileNo&&!$scope.mobileNo.length == '11'){
            		ngDialog.open({
							template: '<p>请输入手机号码</p>',
							plain: true,
							closeByDocument: false,
							closeByEscape: false
					});
            	}else if(!$scope.timer.kedian){
            		httpService.linkHttp(apiUrl.send,{'mobileNo':$scope.mobileNo,'type':7})
	                .then(function(res){
	                	console.log(res)
	                	if(res.data.errCode == '000000'){
							$scope.timer.kedian =true;
			                $interval(function(){
			                    $scope.timer.time--;
			                    $scope.timer.data = '获取验证码('+$scope.timer.time+')';
			                    if($scope.timer.time == 0){
			                    	$scope.timer.kedian = false;
			                    	$scope.timer.time = 120
			                    	$scope.timer.data = '重新获取验证码'
			                    }
			                },1000,$scope.timer.time)
	                	}
	                })
            		
            	}
            }

			$scope.numberOldChange = function() { //旧密码
				if (timeout) {
					$timeout.cancel(timeout);
				}
				var timeout = $timeout(function() {
					$scope.numberIs.oldPassword = false
					switch (true) {
						case !reg1.test($scope.number.oldPassword):
							$scope.numberWarn = '密码必须为数字、字母或英文字符、字母区分大小写'
							break;
						default:
							// httpService.linkHttp(apiUrl.validateSignPassword, {
							// 		customerId: '217979635127',
							// 		password: Md5.hex_md5($scope.number.oldPassword)
							// 	})
							// 	.then(function(res) {
							// 		console.log(res)
							// 		if (res.data.errCode == '000000') {
							// 			$scope.numberIs.oldPassword = true
							// 			$scope.autographWarn = ''
							// 			if (!$scope.number.newPassword) {
							// 				$scope.numberNewChange()
							// 			}
							// 			if (!$scope.number.cmNewPassword) {
							// 				$scope.numberCmNewChange()
							// 			}
							// 		} else {
							// 			$scope.autographWarn = res.data.errDesc
							// 			$scope.numberIs.oldPassword = false;
							// 			return false
							// 		}
							// 	})

							$scope.numberIs.oldPassword = true
							$scope.numberWarn = ''
							break;
					}
				}, 450);

			}

			$scope.numberNewChange = function() { //新密码
				if (timeout) {
					$timeout.cancel(timeout);
				}
				var timeout = $timeout(function() {
					$scope.numberIs.newPassword = false
					switch (true) {
						case !$scope.number.newPassword:
							$scope.numberWarn = '请输入新密码'
							break;
						case !reg1.test($scope.number.newPassword):
							$scope.numberWarn = '密码必须为数字、字母或英文字符、字母区分大小写'
							break;
						case $scope.number.cmNewPassword && $scope.number.newPassword !== $scope.number.cmNewPassword:
							$scope.numberWarn = '请与输入密码保持一致'
							break;
						default:
							$scope.autographWarn = ''
							if (!$scope.number.cmNewPassword) {
								$scope.numberCmNewChange()
							}
							$scope.numberIs.newPassword = true
							break;
					}
				}, 350);
			}

			$scope.numberCmNewChange = function() { //确认新密码
				console.log(reg1.test($scope.number.cmNewPassword))
				if (timeout) {
					$timeout.cancel(timeout);
				}
				var timeout = $timeout(function() {
					$scope.numberIs.cmNewPassword = false
					switch (true) {
						case !$scope.number.newPassword:
							$scope.numberWarn = '请输入新密码'
							break;
						case !$scope.number.cmNewPassword:
							$scope.numberWarn = '请输入确认密码'
							break;
						case !reg1.test($scope.number.cmNewPassword):
							$scope.numberWarn = '密码必须为数字、字母或英文字符、字母区分大小写'
							break;
						case $scope.number.newPassword !== $scope.number.cmNewPassword:
							$scope.numberWarn = '请与输入密码保持一致'
							break;
						default:
							$scope.numberWarn = ''
							if (!$scope.number.newPassword) {
								$scope.autographNewChange()
							}
							if (!$scope.number.cmNewPassword) {
								$scope.autographCmNewChange()
							}
							$scope.numberIs.cmNewPassword = true
							break;
					}
				}, 350);
			}


			$scope.autograph = { //修改加签密码
				'oldPassword': '', //旧密码
				'newPassword': '', //新密码
				'cmNewPassword': '' //确认新密码
			}

			$scope.autographIs = {
				'oldPassword': false, //旧密码
				'newPassword': false, //新密码
				'cmNewPassword': false //确认新密码
			}

			$scope.autographOldChange = function() { //旧密码
					$scope.autographIs.oldPassword = false
					switch (true) {
						case !reg.test($scope.autograph.oldPassword):
							$scope.autographWarn = '签名密码必须为数字'
							break;
						case $scope.autograph.oldPassword.length < 6:
							$scope.autographWarn = '密码必须为6位数字'
							break;
						default:
							if($scope.autograph.oldPassword.length == 6){
								httpService.linkHttp(apiUrl.validatePassword, {
									password: Md5.hex_md5($scope.autograph.oldPassword+'THGDHbtzhy7lN3do')
								})
								.then(function(res) {
									if (res.data.errCode == '000000') {
										$scope.autographIs.oldPassword = true
										$scope.autographWarn = ''
										if (!$scope.autograph.newPassword) {
											$scope.autographNewChange()
										}
										if (!$scope.autograph.cmNewPassword) {
											$scope.autographCmNewChange()
										}
									} else {
										$scope.autographWarn = res.data.errDesc
										$scope.autographIs.oldPassword = false;
										return false
									}
								})
							}
							break;
					}
			}

			$scope.autographNewChange = function() { //新密码
				if (timeout) {
					$timeout.cancel(timeout);
				}
				var timeout = $timeout(function() {
					$scope.autographIs.newPassword = false
					switch (true) {
						case !$scope.autograph.oldPassword:
							$scope.autographWarn = '请输入原密码'
							break;
						case !$scope.autograph.newPassword:
							$scope.autographWarn = '请输入新密码'
							break;
						case !reg.test($scope.autograph.newPassword):
							$scope.autographWarn = '签名密码必须为数字'
							break;
						case $scope.autograph.newPassword.length < 6:
							$scope.autographWarn = '密码必须为6位数字'
							break;
						case $scope.autograph.cmNewPassword && $scope.autograph.newPassword !== $scope.autograph.cmNewPassword:
							$scope.autographWarn = '请与输入密码保持一致'
							break;
						default:
							$scope.autographWarn = ''
							if (!$scope.autograph.cmNewPassword) {
								$scope.autographCmNewChange()
							}
							$scope.autographIs.newPassword = true
							break;
					}
				}, 350);
			}

			$scope.autographCmNewChange = function() { //确认新密码
				if (timeout) {
					$timeout.cancel(timeout);
				}
				var timeout = $timeout(function() {
					$scope.autographIs.cmNewPassword = false
					switch (true) {
						case !$scope.autograph.oldPassword:
							$scope.autographWarn = '请输入原密码'
							break;
						case !$scope.autograph.newPassword:
							$scope.autographWarn = '请输入新密码'
							break;
						case !$scope.autograph.cmNewPassword:
							$scope.autographWarn = '请输入确认密码'
							break;
						case !reg.test($scope.autograph.cmNewPassword):
							$scope.autographWarn = '签名密码必须为数字'
							break;
						case $scope.autograph.cmNewPassword.length < 6:
							$scope.autographWarn = '密码必须为6位数字'
							break;
						case $scope.autograph.newPassword !== $scope.autograph.cmNewPassword:
							$scope.autographWarn = '请与输入密码保持一致'
							break;
						default:
							$scope.autographWarn = ''
							if (!$scope.autograph.newPassword) {
								$scope.autographNewChange()
							}
							if (!$scope.autograph.cmNewPassword) {
								$scope.autographCmNewChange()
							}
							$scope.autographIs.cmNewPassword = true
							break;
					}
				}, 350);
			}


			$scope.autographClick = function() {
				console.log($scope.autographIs)
				if (!$scope.autographIs.oldPassword || !$scope.autographIs.newPassword || !$scope.autographIs.cmNewPassword) {
					$scope.autographOldChange()
					$scope.autographNewChange()
					$scope.autographCmNewChange()
				} else {
					ngDialog.openConfirm({
						template: '<div>你确定签名修改密码？</div><div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                	</div>',
						plain: true,
						className: 'ngdialog-theme-default',
						scope: $scope
					}).then(function(value) {
						var autographData = {
							oldPassword: Md5.hex_md5($scope.autograph.oldPassword +'THGDHbtzhy7lN3do'),
							newPassword: Md5.hex_md5($scope.autograph.cmNewPassword +'THGDHbtzhy7lN3do')
						}

						httpService.linkHttp(apiUrl.modifyPassword, autographData)
							.then(function(res) {
								if (res.data.errCode != '000000') {
									$scope.autographWarn = res.data.errDesc
								} else {
									var dialog = ngDialog.open({
										template: '<p>签名密码修改成功</p>',
										plain: true,
										closeByDocument: false,
										closeByEscape: false
									});
									setTimeout(function() {
										dialog.close();
									}, 1000);
									$scope.autograph = { //修改加签密码
										'oldPassword': '', //旧密码
										'newPassword': '', //新密码
										'cmNewPassword': '' //确认新密码
									}
								}
							})
					}, function(reason) {
						console.log('取消');
					});

				}

			}
			

			httpService.linkHttp(apiUrl.doctorDetail,{doctorId:$rootScope.userInfo.data.customerId})
				.then(function(res){
					$scope.userData = res.data.data
				})

		}
	]).name