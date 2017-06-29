'use strict';
require('./index.scss')
module.exports = angular.module('app.loginrx', []).config(function($stateProvider) {
    $stateProvider.state('loginrx', {
        url: '/loginrx',
        title:'远程审方平台',
        isHead:false,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'loginrxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.loginrx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.loginrx'
                    });
                    deferred.resolve(mod.controller);
                }, 'loginrx-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
