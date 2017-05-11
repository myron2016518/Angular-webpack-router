'use strict';
require('./index.scss')
module.exports = angular.module('app.prescriptionaudit', []).config(function($stateProvider) {
    $stateProvider.state('examine.prescriptionaudit', {
        url: '/prescriptionaudit/:orderNo',
        title:'接诊室',
        isHead:false,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'prescriptionauditCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.prescriptionaudit': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.prescriptionaudit'
                    });
                    deferred.resolve(mod.controller);
                }, 'prescriptionaudit-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
