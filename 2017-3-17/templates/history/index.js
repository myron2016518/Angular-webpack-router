'use strict';
module.exports = angular.module('historyModule', [
	require('./list/service.js'),
    require('./details/service.js'),
]).name;