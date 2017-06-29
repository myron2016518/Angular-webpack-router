'use strict';
require('./index.scss')
module.exports = angular.module('app.examinerx', []).config(function($stateProvider) {
    $stateProvider.state('examinerx', {
        url: '/examinerx',
        title:'申请证书',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'examinerxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.examinerx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.examinerx'
                    });
                    deferred.resolve(mod.controller);
                }, 'examinerx-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
