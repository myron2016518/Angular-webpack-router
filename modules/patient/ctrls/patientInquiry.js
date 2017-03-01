define(['../patientModule'], function(module) {
	module.controller("patientInquiryCtrl", ['$scope', '$state', '$stateParams', 'httpService', function($scope, $state, $stateParams, httpService) {
		'use strict';
		console.log('patientInquiryCtrl');
		$scope.searchOtherInfo = function(url) {
			$state.go(url);
		}

		if ($stateParams.Id) {
			$scope.patientId = $stateParams.Id;
		}
		$scope.tableConf = {
			"tableHead": [{
				"name": "序号",
				"width": "1"
			}, {
				"name": "订单编号",
				"width": "2"
			}, {
				"name": "所属区域",
				"width": "1"
			}, {
				"name": "来源医院",
				"width": "2"
			}, {
				"name": "视频/图文",
				"width": "1"
			}, {
				"name": "是否收费",
				"width": "1"
			}, {
				"name": "问诊科室",
				"width": "1"
			}, {
				"name": "问诊医生",
				"width": "1"
			}, {
				"name": "挂号时间",
				"width": "2"
			}],
			"tableTr": "",
			"totalNum": 3
		}
		$scope.pInquiryInfo = {
			"pageCount": "1",
			"inquiryFailNum": "--",
			"iamgeInquiryNum": "0",
			"inquiryNum": "3",
			"pageNum": "1",
			"totalNum": "3",
			"inquiryDepartmentNum": "2",
			"inquiryOrderList": [{
				"deptName": "1",
				"area": "--",
				"orderNo": "3",
				"inqType": "视频",
				"queueDate": "2017-02-25 14:07:26",
				"hospitalName": "1",
				"isCharge": "否",
				"inqTime": "",
				"doctorName": "1"
			}, {
				"deptName": "1",
				"area": "--",
				"orderNo": "3",
				"inqType": "视频",
				"queueDate": "2017-02-25 14:07:26",
				"hospitalName": "1",
				"isCharge": "否",
				"inqTime": "",
				"doctorName": "1"
			}, {
				"deptName": "1",
				"area": "--",
				"orderNo": "3",
				"inqType": "视频",
				"queueDate": "2017-02-25 14:07:26",
				"hospitalName": "1",
				"isCharge": "否",
				"inqTime": "",
				"doctorName": "1"
			}],
			"inquiryDoctorNum": "1",
			"videoInquiryNum": "3",
			"freeInquiryNum": "--",
			"chargeInquiryNum": "--",
			"inquirySuccessNum": "--"
		}
		$scope.tableConf.tableTr = $scope.pInquiryInfo.inquiryOrderList;

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