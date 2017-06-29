'use strict';
console.log(require('../services/httpService.js'))
module.exports = angular.module('servicesModule',[
    require('../services/httpService.js')
]).name;
