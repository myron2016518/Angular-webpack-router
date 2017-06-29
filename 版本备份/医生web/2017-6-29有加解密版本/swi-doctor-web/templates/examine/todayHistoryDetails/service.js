'use strict';
require('./index.scss')
module.exports = angular.module('app.todayHistoryDetails', []).config(function($stateProvider) {
    $stateProvider.state('examine.todayHistoryDetails', {
        url: '/todayHistoryDetails/:id',
        title:'审核历史详情',
        isHead:true,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'historyDetailsCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.todayHistoryDetails': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.todayHistoryDetails'
                    });
                    deferred.resolve(mod.controller);
                }, 'todayHistoryDetails-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
