'use strict';
require('./index.scss')
module.exports = angular.module('app.user', []).config(function($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        title:'账号管理',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'userCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.user': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.user'
                    });
                    deferred.resolve(mod.controller);
                }, 'user-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
