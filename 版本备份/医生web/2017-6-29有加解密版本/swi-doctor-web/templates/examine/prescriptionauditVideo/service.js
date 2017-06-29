'use strict';
require('./index.scss')
module.exports = angular.module('app.prescriptionauditVideo', []).config(function($stateProvider) {
    $stateProvider.state('examine.prescriptionauditVideo', {
        url: '/prescriptionauditVideo/:orderNo',
        title:'接诊室',
        isHead:false,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'prescriptionauditVideoCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.prescriptionauditVideo': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.prescriptionauditVideo'
                    });
                    deferred.resolve(mod.controller);
                }, 'prescriptionauditVideo-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
