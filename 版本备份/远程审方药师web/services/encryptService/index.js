'use strict';
module.exports = angular.module('encryptServiceModule', [
	require('./encrypt.js'),
	require('./randomNumber.js'),
	require('./Signature.js'),
]).name;