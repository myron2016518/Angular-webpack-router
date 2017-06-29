'use strict';
module.exports = angular.module('examineModule', [
	require('./examine/service.js'),
	require('./prescriptionaudit/service.js'),
	require('./starttrial/service.js'),
	require('./triallohandle/service.js'),
	require('./prescribe/service.js'),
	require('./prescriptionauditVideo/service.js'),
	require('./todayHistory/service.js'),
	require('./todayHistoryDetails/service.js')
]).name;