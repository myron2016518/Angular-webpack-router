'use strict';
require('./index.scss')
module.exports = angular.module('app.prescriptionauditrx', []).config(function($stateProvider) {
    $stateProvider.state('examinerx.prescriptionauditrx', {
        url: '/prescriptionauditrx/:orderNo',
        title:'审方处理',
        isHead:true,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'prescriptionauditrxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.prescriptionauditrx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.prescriptionauditrx'
                    });
                    deferred.resolve(mod.controller);
                }, 'prescriptionauditrx-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
