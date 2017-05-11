/**
 * 主要业务逻辑相关
 */
var userUID = readCookie("uid")
/**
 * 实例化
 * @see module/base/js
 */
var yunXin = new YX(userUID)

var _base = 'http://dev-admin.siruijk.com:8006';

var SWIUI = SWIUI || {};
SWIUI = {
	InitDialog: function(usdata){
		var _account = usdata.account;
		var _pwd = usdata.pwd;
		var _openAccount = usdata.openAccount;
		var _type = usdata.type || 'p2p';
		var _opentype = usdata.opentype
		/*setCookie('uid', _account.toLocaleLowerCase());
		//自己的appkey就不用加密了
		 setCookie('sdktoken',_pwd);
		//setCookie('sdktoken', MD5(_pwd));
		userUID = readCookie("uid");
		yunXin = new YX(userUID);*/
		setTimeout(function(){
			yunXin.openChatBox(_openAccount,_type);
			if(_opentype == 0){
				$('#showNetcallVideoLink').addClass('hide');
				$('#chatBox').addClass('hide');
				
			}else{
				$('#chatBoxIM').attr('style','width: 50%;float: left;');
				
			}
			$('#showNetcallAudioLink').addClass('hide');
		},3000);
		this.initClick();
	},
	initClick: function() {
		$("#headImg").unbind('click').on('click',this.showInfo2.bind(this));
		$(".closeUserInfo").unbind('click').on('click',this.closeInfo2.bind(this));
		
	},
	showInfo2: function() {
		$('.userInfo').removeClass('hide');
		var userInfo = JSON.parse(window.sessionStorage.getItem('user'));
		var _token = userInfo.data.token;
		var _orderNo = getUrlParameter('orderNo');
		var _baseUrl = _base+'/app/inner/v1/inquiry/detail?orderNo='+_orderNo+'&token='+_token;
		$.ajax({
            type: 'GET',
            url: _baseUrl,
            dataType: 'json',
            success: function(d){
                console.log(d);
                // 时间取值 问诊时间： inquiryDate
            },
            error: function(e){
               console.log(e);
            }
        });
	},
	closeInfo2: function() {
		$('.userInfo').addClass('hide');
	}
}
var getUrlParameter=function(name){
		var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");//正则表达式取得url中的参数
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]); return null;
	}

$(function(){
	
	//'account':'xpc20','pwd':'123456','openAccount':'xpc11','openType':'p2p'
	var _getAccount = getUrlParameter('account');
	var _getpwd = getUrlParameter('pwd');
	var _huanzheID = getUrlParameter('huanzheID');
	var _patientName = getUrlParameter('patientName');
	var _orderNo = getUrlParameter('orderNo');
	var _opentype = getUrlParameter('opentype');
	
	
	document.getElementById('patientName').innerText = "与患者" + _patientName + "对话中";
	document.getElementById('videopatientName').innerText = "患者" + _patientName + "请求与您进行视频通话";
	
	console.log(_opentype);
	var getData = {
		'account':_getAccount,
		'pwd':_getpwd,
		'openAccount':_huanzheID,
		'type':'p2p',
		'opentype':_opentype
	}
	SWIUI.InitDialog(getData);
})
