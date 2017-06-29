'use strict';
require('./index.scss')
module.exports = angular.module('app.prescribe', []).config(function($stateProvider) {
    $stateProvider.state('examine.prescribe', {
        url: '/prescribe/:orderNo',
        title:'开处方',
        isHead:true,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'prescribeCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.prescribe': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.prescribe'
                    });
                    deferred.resolve(mod.controller);
                }, 'prescribe-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
