'use strict';
require('./index.scss')
module.exports = angular.module('app.userrx', []).config(function($stateProvider) {
    $stateProvider.state('userrx', {
        url: '/userrx',
        title:'账号管理',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'userrxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.userrx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.userrx'
                    });
                    deferred.resolve(mod.controller);
                }, 'userrx-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
