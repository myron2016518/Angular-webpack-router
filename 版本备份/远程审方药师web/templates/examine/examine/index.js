module.exports = angular.module("app.examine")
    .controller("examineCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', 'Md5', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl,Md5) {
		
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
		
		
         console.log($rootScope.userInfo);   
		$scope.doctorId = $rootScope.userInfo.doctorId;
		$scope.doctorName =  $rootScope.userInfo.doctorName;
		$scope.mobileNo =  '13415423512';
		
		$scope.PWDisOK = false;
		$scope.pwdPro = false;
        $scope.pwdcfPro = false;
		$scope.ispwdcfPro = false;
		$scope.userdata = {
				'name': $rootScope.userInfo.doctorName,
				'sex': $rootScope.userInfo.sex == '0'?'女':'男',
				'sexNo': $rootScope.userInfo.sex,
				'idNo': $rootScope.userInfo.idNo,
				'qualificationNo': $rootScope.userInfo.qualificationNo,
				'registrationNo': $rootScope.userInfo.registrationNo,
				'validDate': $rootScope.userInfo.validDate
		}
		
		
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
			var data = {
				'doctorId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.certificate, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					if(data.data.flag == "1" ) {
						$state.go('examine.starttrial');
					}else{
						
					}
				}else{
					$state.go('login');
				}
			});
		}
		
    }]).name
