define(['../patientModule'], function(module) {
	module.controller("patientRegisterCtrl", ['$scope', '$state', '$stateParams', 'httpService', function($scope, $state, $stateParams, httpService) {
		'use strict';
		console.log('patientRegisterCtrl');
		$scope.searchOtherInfo = function(url) {
			$state.go(url);
		}

		if ($stateParams.Id) {
			$scope.patientId = $stateParams.Id;
		}

		$scope.pRegisterInfo = {
			"registerInfo": {
				"registerNum": "42",
				"registerSuccessNum": "22",
				"registerFailNum": "12",
				"registerHospitalNum": "4",
				"registerDepartmentNum": "12"
			}

		}

	}])
});