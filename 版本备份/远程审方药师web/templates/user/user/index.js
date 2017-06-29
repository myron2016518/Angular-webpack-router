module.exports = angular.module("app.user")
	.controller("userCtrl", ['$scope', '$rootScope', '$state', 'httpService', '$stateParams', 'apiUrl', '$location', '$timeout', 'Md5', 'ngDialog',
		function($scope, $rootScope, $state, httpService, $stateParams, apiUrl, $location, $timeout, Md5, ngDialog) {

			$location.search('type', 'autograph')

			$scope.isHide = 'autograph'

			$scope.isPage = function(data) {
				$location.search('type', data)
				$scope.isHide = $location.search().type
			}

			var reg1 = /^(\w){6,16}$/;
			var reg = /^[0-9]*$/;
			// var reg = new RegExp('^\d{6,}$')

			$scope.autographWarn = ''
			$scope.numberWarn = ''
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
						case !$scope.number.oldPassword:
							$scope.numberWarn = '请输入原密码'
							break;
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
						case !$scope.number.oldPassword:
							$scope.numberWarn = '请输入原密码'
							break;
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

				if (timeout) {
					$timeout.cancel(timeout);
				}
				var timeout = $timeout(function() {
					$scope.autographIs.oldPassword = false
					switch (true) {
						case !reg.test($scope.autograph.oldPassword):
							$scope.autographWarn = '签名密码必须为数字'
							break;
						case $scope.autograph.oldPassword.length < 6:
							$scope.autographWarn = '密码必须为6位数字'
							break;
						default:
							httpService.linkHttp(apiUrl.validateSignPassword, {
									'doctorId': $rootScope.userInfo.doctorId,
									'password': Md5.hex_md5($scope.autograph.oldPassword)
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
							break;
					}
				}, 450);

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
						//doctorId  药师ID oldPassword 旧密码  newPassword新密码 confirmPassword 确认密码
						var autographData = {
							doctorId:$rootScope.userInfo.doctorId,
							oldPassword: Md5.hex_md5($scope.autograph.oldPassword),
							newPassword: Md5.hex_md5($scope.autograph.newPassword),
							confirmPassword: Md5.hex_md5($scope.autograph.cmNewPassword)
						}

						httpService.linkHttp(apiUrl.modifySignPassword, autographData)
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


		}
	]).name