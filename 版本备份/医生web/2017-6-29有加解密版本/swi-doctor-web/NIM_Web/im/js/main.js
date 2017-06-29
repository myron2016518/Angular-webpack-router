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
		var _doctorName = usdata.doctorName;
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
			
			var _info = {
				'type':_type,
				'toID':_openAccount,
				'text':'您好！我是'+ _doctorName +'医生，由我来为您接诊！'
			}
			sendMsgInit(_info);
			
			var _tipinfo = {
				'type':_type,
				'toID':_openAccount,
				'text':'{"operateType":"start_inquiry"}'
			}
			sendTipMsgInit(_tipinfo);
			
		},3000);
		this.initClick();
	},
	initClick: function() {
		$("#headImg").unbind('click').on('click',this.showInfo2.bind(this));
		$(".closeUserInfo").unbind('click').on('click',this.closeInfo2.bind(this));
		
	},
	showInfo2: function() {
		$('.userInfo').removeClass('hide');
		
		var patientInfo = JSON.parse(window.sessionStorage.getItem('patientInfo'));
		var _itme = patientInfo;
        $('#patientNameInfo').html(_itme.patientName);
        $('#patientSex').html(_itme.sex == '0'?'女':'男');
        $('#patientAge').html(_itme.age + '岁');
        $('#inquiryDate').html(getLocalTime(_itme.inquiryDate));
        $('#deptName').html(_itme.deptName);
        $('#chiefComplaint').html(_itme.chiefComplaint);
        $('#pastHistory').html(_itme.pastHistory);
        $('#preliminaryDiagnosis').html(_itme.preliminaryDiagnosis);
        $('#doctorAdvice').html(_itme.doctorAdvice);
        
		/*var userInfo = JSON.parse(window.sessionStorage.getItem('DRWEB_user'));
		var _token = userInfo.data.token;
		var _orderNo = getUrlParameter('orderNo');
		var _baseUrl = _base+'/app/inner/v1/doctor/queryCaseDetail?orderNo='+_orderNo+'&token='+_token;
		$.ajax({
            type: 'GET',
            url: _baseUrl,
            dataType: 'json',
            success: function(d){
                console.log(d);
                // 时间取值 问诊时间： inquiryDate
                //var _itme = window.JSON.parse(d.data)
                var _itme = d.data
                $('#patientNameInfo').html(_itme.patientName);
                $('#patientSex').html(_itme.sex == '0'?'女':'男');
                $('#patientAge').html(_itme.age + '岁');
                $('#inquiryDate').html(getLocalTime(_itme.inquiryDate));
                $('#deptName').html(_itme.deptName);
                $('#chiefComplaint').html(_itme.chiefComplaint);
                $('#pastHistory').html(_itme.pastHistory);
                $('#preliminaryDiagnosis').html(_itme.preliminaryDiagnosis);
                $('#doctorAdvice').html(_itme.doctorAdvice);
            },
            error: function(e){
               console.log(e);
            }
        });*/
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

function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}     

function publicSendMsg(opt){
	var _huanzheID = getUrlParameter('huanzheID');
	//debugger
	var _info = {
		'type':'p2p',
		'toID':_huanzheID,
		'text':'您好！我是来执行关闭的！'
	}
	
	if(opt.stutas == 'start'){
		_info.text = '{"operateType":"start_inquiry"}';
	}else if(opt.stutas == 'cancel'){
		_info.text = '{"operateType":"cancel_inquiry"}';
	}else if(opt.stutas == 'over_no'){
		_info.text = '{"operateType":"over_inquiry_no_prescription","data":{"diagnose":"'+opt.diagnose+'","advice":"'+opt.advice+'"}}';
	}else if(opt.stutas == 'over_has'){
		_info.text = '{"operateType":"over_inquiry_has_prescription","data":{"diagnose":"'+opt.diagnose+'","advice":"'+opt.advice+'"}}';
	}else if(opt.stutas == 'request_hand'){
		_info.text = '{"operateType":"request_hand_shake"}';
	}else if(opt.stutas == 'response_hand'){
		_info.text = '{"operateType":"response_hand_shake"}';
	}else{
		
	}
	
	sendTipMsgInit(_info);
}
function sendMsgInit(info){
	var msg = nim.sendText({
	    scene: info.type,
	    to: info.toID,
	    text: info.text,
	    done: sendShowMsgDone
	});

}
function sendTipMsgInit(info){
	var msg = nim.sendTipMsg({
	    scene: info.type,
	    to: info.toID,
	    tip: info.text,
	    done: sendMsgDone
	});
}
function sendMsgDone(error, msg) {
    console.log(error);
    console.log(msg);
    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
    //pushMsg(msg);
}
function sendShowMsgDone(error, msg) {
    console.log(error);
    console.log(msg);
    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
    pushMsg(msg);
}
function pushMsg(msgs) {
    yunXin.cache.addMsgs(msgs)
    //this.$messageText.val('')
    yunXin.$chatContent.find('.no-msg').remove()
    var msgHtml = appUI.updateChatContentUI(msgs,yunXin.cache)
    yunXin.$chatContent.append(msgHtml).scrollTop(99999)
    $('#uploadForm').get(0).reset()
}
	
	
$(function(){
	
	//'account':'xpc20','pwd':'123456','openAccount':'xpc11','openType':'p2p'
	var _getAccount = getUrlParameter('account');
	var _getpwd = getUrlParameter('pwd');
	var _doctorName = getUrlParameter('doctorName');
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
		'doctorName':_doctorName,
		'openAccount':_huanzheID,
		'type':'p2p',
		'opentype':_opentype
	}
	SWIUI.InitDialog(getData);
})
