'use strict';
require('./index.scss')
module.exports = angular.module('app.todayHistory', []).config(function($stateProvider) {
    $stateProvider.state('examine.todayHistory', {
        url: '/todayHistory',
        title:'今日接诊历史',
        isHead:true,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'todayHistoryCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.todayHistory': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.todayHistory'
                    });
                    deferred.resolve(mod.controller);
                }, 'todayHistory-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
