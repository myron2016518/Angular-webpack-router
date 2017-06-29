'use strict';
require('./index.scss')
module.exports = angular.module('app.login', []).config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        title:'登录',
        isHead:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'loginCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.login': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.login'
                    });
                    deferred.resolve(mod.controller);
                }, 'login-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
