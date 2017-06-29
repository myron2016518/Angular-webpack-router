'use strict';
require('./index.scss')
module.exports = angular.module('app.starttrial', []).config(function($stateProvider) {
    $stateProvider.state('examine.starttrial', {
        url: '/starttrial',
        title:'开始审方',
        isHead:true,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'starttrialCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.starttrial': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.starttrial'
                    });
                    deferred.resolve(mod.controller);
                }, 'starttrial-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
