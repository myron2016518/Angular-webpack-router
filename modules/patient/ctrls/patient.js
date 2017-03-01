require("../css/patient.scss");
define(['../patientModule'], function(module) {
	module.controller("patientCtrl", ['$scope', '$state', 'httpService', function($scope, $state, httpService) {
		'use strict';
		console.log('加载了patientCtrl');
		$scope.tableConf = {
			"tableHead": [{
				"name": "序号",
				"width": "1"
			}, {
				"name": "用户ID",
				"width": "1"
			}, {
				"name": "用户账户",
				"width": "1"
			}, {
				"name": "用户手机号",
				"width": "2"
			}, {
				"name": "来源连锁",
				"width": "3"
			}, {
				"name": "来源门店",
				"width": "3"
			}, {
				"name": "操作",
				"width": "1"
			}],
			"tableTr": [{
				"sourceEnterprise": "北京德开医药科技有限公司（康复之家）",
				"patientId": "1",
				"sourceStore": "康复之家北京安贞医院店",
				"accountNo": "ps",
				"storeId": "138",
				"mobileNo": "18682257583"
			}, {
				"sourceEnterprise": "北京德开医药科技有限公司（康复之家）",
				"patientId": "1",
				"sourceStore": "康复之家北京安贞医院店",
				"accountNo": "ps",
				"storeId": "138",
				"mobileNo": "18682257583"
			}],
			"recordCount": 2
		}


		$scope.conf = {
			total: 20,
			currentPage: 1,
			itemPageLimit: 1,
			// 是否显示一页选择多少条
			isSelectPage: true,
			// 是否显示快速跳转
			isLinkPage: false
		}

		$scope.$watch('conf.currentPage + conf.itemPageLimit', function(news) {

			// 把你的http请求放到这里
			console.log($scope.conf.currentPage, $scope.conf.itemPageLimit)
		})

	}])
});