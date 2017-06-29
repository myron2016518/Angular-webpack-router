'use strict';
module.exports = angular.module('encryptServiceModule.Crypt', [])
	.service('Crypt', function(Base64, $rootScope) {

		var crypt = new JSEncrypt.JSEncrypt({
			default_key_size: 1024
		});
		$rootScope.Public = window.sessionStorage.getItem('public') == 'undefined' ? '' : JSON.parse(window.sessionStorage.getItem('public'))
		$rootScope.Private = window.sessionStorage.getItem('private') == 'undefined' ? '' : JSON.parse(window.sessionStorage.getItem('private'))

		this.encodeJson = function(data) { //加密json
			crypt.setPublicKey($rootScope.Public.publicKey1) //公钥
			if(data){
				return crypt.encryptLong(JSON.stringify(data))
			}else{
				return null
			}
		}
		//setPublicKey
		//setPrivateKey
		this.decodeJson = function(data) { //解密json
			crypt.setPrivateKey($rootScope.Private.privateKey1)	//私钥
			if(data){
				return JSON.parse(crypt.decryptLong(data))
			}else{
				return null
			}
		}

		this.encode = function(data) { //加密
			crypt.setPublicKey($rootScope.Public.publicKey2) //公钥
			if(data){
				return crypt.encryptLong(data)
			}else{
				return null
			}
		}

		this.decode = function(data) { //解密
			crypt.setPrivateKey($rootScope.Private.privateKey2)	//私钥
			if(data){
				return crypt.decryptLong(data)
			}else{
				return null
			}
		}

	}).name