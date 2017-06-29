module.exports = angular.module("app.examine")
    .controller("examineCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', 'Md5', 'ngDialog', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl,Md5,ngDialog) {
		
		// $scope.conf = {
		// 	'btn':{
		// 		width:'100px',
		// 		height:'30px',
		// 		style:{
		// 			'height':'70px',
		// 		}
		// 	},
		// 	'pop':{
		// 		direction:'top', //top上 right右 bottom下 left左
		// 		width:'100px',
		// 		height:'30px',
		// 		isShow:true
		// 	}
		// }
			
			
		
		$scope.form = {
                'password': '',
                'passwordConfirm': ''
        }
		
		
            
		$scope.doctorId = $rootScope.userInfo.data.userInfo.customerId;
		$scope.doctorName =  $rootScope.userInfo.data.userInfo.name;
		$scope.mobileNo =  $rootScope.userInfo.data.userInfo.mobileNo;
		
		$scope.PWDisOK = false;
		$scope.pwdPro = false;
        $scope.pwdcfPro = false;
		$scope.ispwdcfPro = false;
		$scope.userdata = [
				{'name': ''},
				{'sex': ''},
				{'sexNo': ''},
				{'birthDate': ''},
				{'idNo': ''},
				{'qualificationNo': ''},
				{'registrationNo': ''},
				{'validDate': ''}
		]
		
		
		$scope.dowzhengshu = function(){
			if(!$scope.PWDisOK) return;
			//$scope.pwdPro = !(/\S/.test($scope.form.password));
           // $scope.pwdcfPro = !(/\S/.test($scope.form.passwordConfirm));
			//if($scope.pwdPro || $scope.pwdcfPro) return;
			
			//http://192.168.1.249:8207/web/inner/v1/prescription/audit/setSignPassword?customerId=324837330433&password=e10adc3949ba59abbe56e057f20f883ee
			var data = {
				'doctorId': $scope.doctorId,
				'name': $scope.doctorName,
				'sex': $scope.userdata.sexNo,
				'idNo': $scope.userdata.idNo,
				'mobileNo': $scope.mobileNo,
				'company': '思瑞',
				'postCode': '518000',
				'city': '深圳市',
				'province': '广东省',
				'address': '南山区大冲国际中心5号楼9层',
				'password': Md5.hex_md5($scope.form.passwordConfirm)

			}
			httpService.linkHttp(apiUrl.applicationCertificate, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					$state.go('examine.starttrial');
				}
			});
			
			
		}
		
		$scope.inputPWD = function(){
			if($scope.form.password.length == 6){
				$scope.pwdPro = true;
				if($scope.form.password == $scope.form.passwordConfirm){
					$scope.ispwdcfPro = false;
					if($scope.pwdcfPro == true){
						$scope.PWDisOK = true;
					}
				}else{
					$scope.ispwdcfPro = true;
				}
				
			}else{
				$scope.pwdPro = false;
				$scope.PWDisOK = false;
			}
			
		}
		$scope.inputPWDCF = function(){
			if($scope.form.passwordConfirm.length == 6){
				$scope.pwdcfPro = true;
				if($scope.form.password == $scope.form.passwordConfirm){
					$scope.ispwdcfPro = false;
					if($scope.pwdPro == true){
						$scope.PWDisOK = true;
					}
				}else{
					$scope.ispwdcfPro = true;	
				}
				
			}else{
				$scope.pwdcfPro = false;
				$scope.PWDisOK = false;
			}
		}
		
		
		
		//初始化
		$scope.getDoctorInfo = function() {
			//http://192.168.1.249:8207//web/inner/v1/prescription/audit/doctorInfoQuery?customerId=217979635127
			var indata = {
				'customerId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.doctorInfoQuery, indata).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					
					if(data.data.orderNo == "0"){
						if(data.data.authenticationStatus == "3" ) {
							$state.go('examine.starttrial');
						}else{
							$scope.userdata.name = data.data.name;
							$scope.userdata.sex = data.data.sex == '0'?'女':'男';
							$scope.userdata.sexNo = data.data.sex;
							$scope.userdata.birthDate = data.data.birthDate;
							$scope.userdata.idNo = data.data.idNo;
							$scope.userdata.qualificationNo = data.data.qualificationNo;
							$scope.userdata.registrationNo = data.data.registrationNo;
							$scope.userdata.validDate = data.data.validDate;
						}
					}else{
						
			            var _getOrderNo = data.data.orderNo;
			            var dataStarttrial = {
			                'doctorId': $scope.doctorId,
			                'doctorName': $rootScope.userInfo.data.userInfo.name,
			                'hospitalId': '',
			                'hospitalName': ''
			            }
			        	httpService.linkHttp(apiUrl.queryExamineStarttrial,dataStarttrial).then(function(resStarttrial) {
			                    // 判断请求成功
			                    var datas = resStarttrial.data;
			                   
			                    if (datas.errCode == "000000") {
			                    	ngDialog.open({
						                template: '<div class="ngdialog-message" style="text-align: -webkit-center;text-align: center;color: #666;"><p >您目前有未审核完毕的单，即将转入审核页面。</p></div>',
						                className: 'ngdialog-theme-default',
						                showClose: false,
						                closeByDocument: false,
						                closeByEscape: false,
						                plain: true,
						            });
			                        $timeout(function(){
						            	ngDialog.close();
						            	$state.go('examine.prescriptionaudit',{'orderNo':_getOrderNo});
						            },'2000');
			                    }
			                    
			            });
			            
			            
					}
					
					
				}else{
					$state.go('login');
				}
			});
		}
		
    }]).name
