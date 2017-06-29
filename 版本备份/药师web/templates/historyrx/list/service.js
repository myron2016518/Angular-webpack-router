'use strict';
require('./index.scss')
module.exports = angular.module('app.historyrx', []).config(function($stateProvider) {
    $stateProvider
    .state('historyrx', {
        url: '/historyrx',
        title:'审核历史',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'historyrxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.historyrx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.historyrx'
                    });
                    deferred.resolve(mod.controller);
                }, 'historyrx-ctl');
                return deferred.promise;
            }
        }
    })
}).name;
