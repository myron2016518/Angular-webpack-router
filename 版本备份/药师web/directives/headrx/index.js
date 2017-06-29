'use strict';
require('./css.scss');
module.exports = angular.module('directive.headrx', [])
	.directive('headrxView', function() {
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
				userData:'='
			},
			link: function(scope , ele , attrs , ) {
				scope.logout = scope.conf
				scope.kefuIs = false;
				scope.quitIs = false;
				
				scope.quitClick = function(){
					scope.quitIs = !scope.quitIs
					if(scope.kefuIs) scope.kefuIs = false
				}
			},controller:['$scope','$rootScope','httpService','ngDialog','apiUrl','$state',function($scope,$rootScope,httpService,ngDialog,apiUrl,$state){
				 
				$scope.kefuClick = function(){
					ngDialog.close();
				  	ngDialog.open({
		                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >客服电话:<br/>0755-26656589</p></div>',
		                className: 'ngdialog-theme-default',
		                closeByDocument: false,
		                plain: true,
		            });
				}
				 
				 
				 
				 $scope.loginOut = function(){
		            ngDialog.openConfirm({
						template: '<div style="    text-align: -webkit-center;text-align: center;padding-top:50px;padding-bottom:50px;">你确定要退出当前账号？</div><div class="ngdialog-buttons" >\
                    <button type="button" style="float: none;width: 160px;height: 40px;" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                    <button type="button" style="width: 160px;height: 40px;" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                	</div>',
						plain: true,
						className: 'ngdialog-theme-default',
						scope: $scope,
						width:410,
						height:200,
						showClose: false,
		                closeByEscape: false,
		                closeByDocument: false
					}).then(function(value) {
						var data = {
							'mobileNo':$rootScope.userInfo.mobileNo
						}
						httpService.linkHttp(apiUrl.loginOut,data)
						.then(function(res){
							console.log(res)
							if (res.data.errCode == "000000") {
		                        window.sessionStorage.removeItem('user');
		                        $state.go('loginrx');
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
						//console.log('确定')
					}, function(reason) {
						//console.log('取消');
					});
		        }
			}]
		};
	}).name;