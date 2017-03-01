define(['../patientModule'], function(module) {
	module.controller("patientDetailCtrl", ['$rootScope', '$scope', '$state', 'httpService', '$stateParams', function($rootScope, $scope, $state, httpService, $stateParams) {
		'use strict';
		console.log('加载了patientDetailCtrl');
		if ($stateParams.Id) {
			$scope.patientId = $stateParams.Id;
		}

		$scope.pDetailInfo = {
			"personalData": {
				"medicineNum": "200",
				"lastLoginDate": "2017-02-15",
				"regiteDate": "2017-02-15",
				"healthCheckNum": "21",
				"maxMedicineSum": "100",
				"medicineSum": "19",
				"registerNum": "21",
				"inquiryNum": "3"
			},
			"registerInfo": {
				"sourceEnterprise": "北京德开医药科技有限公司（康复之家）",
				"patientId": "1",
				"sourceStore": "康复之家北京安贞医院店",
				"accountNo": "ps",
				"mobileNo": "18682257583"
			},
			"baseInfo": {
				"idNo": "44141414",
				"birthday": "1992.1.1",
				"sex": "13",
				"weight": "140",
				"height": "179",
				"age": "20",
				"name": "jason",
				"contactNo": "149498392",
				"blood": "A",
				"marriage": "no"
			}

		}
	}])
});