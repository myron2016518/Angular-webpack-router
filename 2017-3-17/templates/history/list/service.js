'use strict';
require('./index.scss')
module.exports = angular.module('app.history', []).config(function($stateProvider) {
    $stateProvider
    .state('history', {
        url: '/history',
        title:'审核历史',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'historyCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.history': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.history'
                    });
                    deferred.resolve(mod.controller);
                }, 'history-ctl');
                return deferred.promise;
            }
        }
    })
}).name;
