'use strict';
require('./index.scss')
module.exports = angular.module('app.agreement', []).config(function($stateProvider) {
    $stateProvider.state('agreement', {
        url: '/agreement',
        title:'互联网医院药师协议',
        isHead:false,
        headClick:false,
        views: {
            'main@': {
                template: require('./index.html'),
                controller: 'agreementCtrl',
                controllerAs: 'vm',
            }
        },
        resolve: {
            'app.agreement': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function() {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.agreement'
                    });
                    deferred.resolve(mod.controller);
                }, 'agreement-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
