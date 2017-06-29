'use strict';
require('./index.scss')
module.exports = angular.module('app.examine', []).config(function($stateProvider) {
    $stateProvider.state('examine', {
        url: '/examine',
        title:'设置加签密码',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'examineCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.examine': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.examine'
                    });
                    deferred.resolve(mod.controller);
                }, 'examine-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
