'use strict';
module.exports = angular.module('httpServiceModule',[])
    .factory('httpService', function($http, $timeout, $state, $q, $rootScope, ngDialog, randomNumber, Signature, Crypt) {
    	
    	function getServerDate(){
            var xhr = null;
            if(window.XMLHttpRequest){
            xhr = new window.XMLHttpRequest();
            }else{ // ie
            xhr = new ActiveObject("Microsoft")
            }

            xhr.open("GET","/",false)//false不可变
            xhr.send(null);
            var date = xhr.getResponseHeader("Date");
            return Math.round(new Date(date).getTime() / 1000);
         }
    	
        //加密参数
        var appSecret = 'e96d90b9e1565866c3775a526d49e015'
        var encryptJson = {
            'srAppid': 'sr5kgp8bptt7e8wlsf',
            "nonce": randomNumber.get(false, 16),
            "timestamp": getServerDate(),
            "srChannel": "h5",
            "signature": '',
            "encodeData": ''
        }

        // 默认参数
        var _httpDefaultOpts = {
            method: 'POST', // GET/DELETE/HEAD/JSONP/POST/PUT
            url: '',
            params: {}, // 拼接在url的参数
            data: {},
            cache: false, // boolean or Cache object
            limit: false, //是否节流
            timeout: "httpTimeout", // 节流变量名
            timeoutTime: 100,
            isErrMsg: true, // 错误提示
            isErrMsgFn: null, // 错误提示函数
            checkCode: false, // 是否校验code
            exclude: true, //是否解密
            loader:true, //是否显示加载动画
            before: function() {
            	if(this.loader){
                	$rootScope.loader = true
            	}
            }, // ajax 执行开始 执行函数
            end: function() {
                $rootScope.loader = false
            }, // ajax 执行结束 执行函数
            error: function() {
                $rootScope.loader = false
            }, // ajax 执行失败 执行函数
            success: function(data) {
                $rootScope.loader = false
                if(data.data.errCode == '000002'){
                    ngDialog.openConfirm({
                        template: '<div>'+ data.data.errDesc+'</div><div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定</button>\
                    </div>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    }).then(function(value) {
                        window.sessionStorage.removeItem('user');
                        $state.go('login');
                    }, function(reason) {
                        window.sessionStorage.removeItem('user');
                        $state.go('login');
                    });
                } else if (this.isErrMsg&&data.data.errCode != '000002'&&data.data.errCode != '000000') {
                    ngDialog.close();
                    var dialog = ngDialog.open({
                        template: '<p>' + data.data.errDesc + '</p>',
                        plain: true,
                        closeByDocument: false,
                        closeByEscape: false
                    });

                }

            }, // ajax 执行成功 执行函数
            checkCodeError: function(code, errMsg, data) {} // ajax 校验code失败 执行函数
        };

        var _httpTimeoutArray = {
            "httpTimeout": null
        }; //ajax节流使用的定时器 集合

        var isErrMsgFn = function(opts) {
            if (angular.isFunction(opts.isErrMsgFn)) {
                opts.isErrMsgFn();
            } else {
                // alert("抱歉！因为操作不能够及时响应，请稍后在试...");
                ngDialog.close();
                var dialog = ngDialog.open({
                    template: '<p>抱歉！因为操作不能够及时响应，请稍后再试...</p>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
            }
        };

        // http请求之前执行函数
        var _httpBefore = function(opts) {
            if (angular.isFunction(opts.before)) {
                opts.before();
            }
        };

        // http请求之后执行函数
        var _httpEnd = function(opts) {
            if (angular.isFunction(opts.end)) {
                opts.end();
            }
            if (opts.limit) {
                $timeout.cancel(_httpTimeoutArray[opts.timeout]);
            }
        };

        // 响应错误判断
        var _responseError = function(data, opts) {
            // public.js
            return checkCode(data, opts);
        };

        // http 请求执行过程封装    deferred ：http 链式请求延迟对象
        var _httpMin = function(opts, deferred) {
            // opts.data = opts.data ? angular.extend(opts.data,encryptJson) : encryptJson
            opts.data = encryptJson
            if (opts.method === 'GET') { //GET请求
                opts.params = opts.data
            } else { //post,put请求
                opts.data = opts.data
            }
            _httpBefore(opts);
            $http({
                method: opts.method,
                url: opts.url,
                params: opts.params,
                data: opts.data
            }).then(function(data, header, config, status) { //响应成功
                // 权限，超时等控制
                if (opts.checkCode && !_responseError(data, opts)) {
                    return false;
                }
                if (opts.exclude) { //接口是否解密
                    data.data.data = Crypt.decodeJson(data.data.data)
                }
                // 请求成功回调函数
                if (opts.success) {
                    opts.success(data, header, config, status);
                }
                if (deferred) {
                    deferred.resolve(data, header, config, status); //任务被成功执行
                }
                _httpEnd(opts);
            }, function(data, header, config, status) { //处理响应失败
                if (opts.isErrMsg) {
                    isErrMsgFn(opts);
                }
                opts.error(data, header, config, status);

                if (deferred) {
                    deferred.reject(data, header, config, status); //任务未被成功执行
                }

                _httpEnd(opts);
            })
        };

        // http请求，内含节流等控制
        var _http = function(opts, deferred) {
            opts = angular.extend({}, _httpDefaultOpts, opts);
            var result;
            if (opts.limit) {
                $timeout.cancel(_httpTimeoutArray[opts.timeout]);
                _httpTimeoutArray[opts.timeout] = $timeout(function() {
                    result = _httpMin(opts, deferred);
                }, opts.timeoutTime);
            } else {
                result = _httpMin(opts, deferred);
            }
        };

        // http 链式请求
        var _linkHttpMin = function(opts, deferred) {
            _http(opts, deferred);
        };

        return {
            /**
             * http请求
             * @param opts
             */
            http: function(opts, data) {
                opts.data = data
                encryptJson.timestamp = getServerDate()
                    //获取签名方法
                encryptJson.signature = Signature.get(
                    appSecret,
                    encryptJson.timestamp,
                    encryptJson.nonce,
                    data
                )
                encryptJson.encodeData = data ? Crypt.encodeJson(data) : "" //obj存在进行加密
                _http(opts);
            },
            /**
             * http链式请求
             * @param opts
             * @param deferred
             * @returns {deferred.promise|{then, catch, finally}}
             * then 成功
             * catch 失败
             */
            linkHttp: function(opts, data, deferred) {
            	encryptJson.timestamp = getServerDate()
                opts.data = data
                    //获取签名方法
                encryptJson.signature = Signature.get(
                    appSecret,
                    encryptJson.timestamp,
                    encryptJson.nonce,
                    data
                )
                encryptJson.encodeData = data ? Crypt.encodeJson(data) : "" //obj存在进行加密
                deferred = deferred || $q.defer();
                _linkHttpMin(opts, deferred);
                return deferred.promise;
            }
        };
    }).name