'use strict';
require('./index.scss')
module.exports = angular.module('app.triallohandlerx', []).config(function($stateProvider) {
    $stateProvider.state('examinerx.triallohandlerx', {
        url: '/triallohandlerx',
        title:'审方处理',
        isHead:true,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'triallohandlerxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.triallohandlerx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.triallohandlerx'
                    });
                    deferred.resolve(mod.controller);
                }, 'triallohandlerx-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
