'use strict';
module.exports = angular.module('encryptServiceModule.randomNumber',[])
	.service('randomNumber', function(){
    	this.get = function (randomFlag, min, max) {
			var str = "",
				range = min,
				arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
				pos

			// 随机产生
			if (randomFlag) {
				range = Math.round(Math.random() * (max - min)) + min;
			}
			for (var i = 0; i < range; i++) {
				pos = Math.round(Math.random() * (arr.length - 1));
				str += arr[pos];
			}
			return str;
		}
    }).name