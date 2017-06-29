'use strict';
module.exports = angular.module('examinerxModule', [
	require('./examine/service.js'),
	require('./prescriptionaudit/service.js'),
	require('./starttrialrx/service.js'),
	require('./triallohandle/service.js'),
]).name;