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
				suspensionOrder:'=',
				suspensionText:'='
			},
			link: function(scope , ele , attrs , ) {
				scope.logout = scope.conf
				scope.kefuIs = false;
				scope.kefuClick = function(){
					scope.kefuIs = !scope.kefuIs
				}
			}
		};
	}).name;