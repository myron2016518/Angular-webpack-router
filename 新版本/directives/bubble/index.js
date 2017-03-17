'use strict';
require('./css.scss');
module.exports = angular.module('directive.bubble', [])
	.directive('bubble', function() {
		return {
			restrict: 'AE',
			template: require('./bubble.html'),
			replace: true,
			scope: {
				conf: '='
			},
			link: function(scope , ele , attrs) {
				console.log(scope.conf)
				scope.popData = '<div>我是冒泡</div>'
				scope.bubbleIs = scope.conf.pop.isShow?scope.conf.pop.isShow:false;
				// scope.bubbleClick = function(){
				// 	scope.bubbleIs = !scope.bubbleIs
				// }

				if(scope.conf.pop.direction == 'top'){
					scope.popClass = 'bubble-pop-top'
				}else if(scope.conf.pop.direction == 'left') {
					scope.popClass = 'bubble-pop-left'
				}else if(scope.conf.pop.direction == 'right') {
					scope.popClass = 'bubble-pop-right'
				}else {
					scope.popClass = 'bubble-pop-bottom'
				}

				console.log(scope.popClass)
			}
		};
	}).name;