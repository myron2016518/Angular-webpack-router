'use strict';
require('./css.scss');
module.exports = angular.module('directive.head', [])
	.directive('headView', function() {
		return {
			restrict: 'AE',
			template: require('./head.html'),
			replace: true,
			scope: {
				conf: '=',
				ishead: '=',
				headClick:'=',
				clickAlert:'=',
				stopTrial:'=',
				userData:'=',
				loginOut:'='
			},link: function(scope , ele , attrs) {
				scope.logout = scope.conf
				scope.kefuIs = false;
				scope.quitIs = false;
				scope.kefuClick = function(){
					scope.kefuIs = !scope.kefuIs
					if(scope.quitIs) scope.quitIs = false
				}
				scope.quitClick = function(){
					scope.quitIs = !scope.quitIs
					if(scope.kefuIs) scope.kefuIs = false
				}
			},controller:['$scope','$rootScope','httpService','ngDialog','apiUrl','$state',function($scope,$rootScope,httpService,ngDialog,apiUrl,$state){
				 $scope.loginOut = function(){
		            ngDialog.openConfirm({
						template: '<div>你确定退出登录吗？</div><div class="ngdialog-buttons" style="text-align: -webkit-right;text-align: right;">\
                    <button type="button" style="float: none;" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                	</div>',
						plain: true,
						className: 'ngdialog-theme-default',
						scope: $scope
					}).then(function(value) {

						var data = {
							'clientType':'5',
							'mobileNo':$scope.userData.data.mobileNo
						}

						httpService.linkHttp(apiUrl.loginOut,data)
						.then(function(res){
							console.log(res)
							if (res.data.errCode == "000000") {
		                        window.sessionStorage.removeItem('user');
		                        $state.go('login');
		                        $scope.quitIs = !$scope.quitIs
		                    } else {
		                        var dialog = ngDialog.open({
		                            template: '<p>'+res.data.errDesc+'</p>',
		                            plain: true,
		                            closeByDocument: false,
		                            closeByEscape: false
		                        });
		                        setTimeout(function() {
		                            dialog.close();
		                        }, 1000);
		                    }
						})

						console.log('确定')
					}, function(reason) {
						console.log('取消');
					});
		        }
			}]
		};
	}).name;