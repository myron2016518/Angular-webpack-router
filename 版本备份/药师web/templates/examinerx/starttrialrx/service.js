'use strict';
require('./index.scss')
module.exports = angular.module('app.starttrialrx', []).config(function($stateProvider) {
    $stateProvider.state('examinerx.starttrialrx', {
        url: '/starttrialrx',
        title:'开始审方',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'starttrialrxCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.starttrialrx': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.starttrialrx'
                    });
                    deferred.resolve(mod.controller);
                }, 'starttrialrx-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
