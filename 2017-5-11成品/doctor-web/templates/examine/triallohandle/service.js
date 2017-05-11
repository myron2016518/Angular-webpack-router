'use strict';
require('./index.scss')
module.exports = angular.module('app.triallohandle', []).config(function($stateProvider) {
    $stateProvider.state('examine.triallohandle', {
        url: '/triallohandle',
        title:'候诊室',
        isHead:true,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'triallohandleCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.triallohandle': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.triallohandle'
                    });
                    deferred.resolve(mod.controller);
                }, 'triallohandle-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
