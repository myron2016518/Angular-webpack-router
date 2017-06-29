'use strict';
module.exports = angular.module('servicesModule',[
    require('../services/httpService.js'),
    require('../services/encryptService/index.js')
]).name;
