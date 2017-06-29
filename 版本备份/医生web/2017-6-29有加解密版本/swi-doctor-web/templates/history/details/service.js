'use strict';
require('./index.scss')
module.exports = angular.module('app.historyDetails', []).config(function($stateProvider) {
    $stateProvider.state('history.details', {
        url: '/details/:id',
        title:'审核历史详情',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'historyDetailsCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.historyDetails': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.historyDetails'
                    });
                    deferred.resolve(mod.controller);
                }, 'historyDetails-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
