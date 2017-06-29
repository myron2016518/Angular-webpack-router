'use strict';
module.exports = angular.module('routersModule', [
    require('../templates/history/index.js'),
    require('../templates/examine/index.js'),
    require('../templates/user/index.js'),
    require('../templates/login/service.js'),
    require('../templates/agreement/service.js'),
    require('../templates/examinerx/index.js'),
    require('../templates/loginrx/service.js'),
    require('../templates/historyrx/index.js'),
    require('../templates/userrx/index.js')
]).name;