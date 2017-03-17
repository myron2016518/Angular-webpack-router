module.exports = angular.module("app.examine")
    .controller("examineCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', 'Md5', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl,Md5) {
		
		console.log('这是index:')
		$scope.conf = {
			'btn':{
				width:'100px',
				height:'30px',
				style:{
					'height':'70px',
				}
			},
			'pop':{
				direction:'top', //top上 right右 bottom下 left左
				width:'100px',
				height:'30px',
				isShow:true
			}
		}
			
			
		
		$scope.form = {
                'password': '',
                'passwordConfirm': ''
        }
		
		$scope.doctorId = '217979635127';
		$scope.PWDisOK = false;
		$scope.pwdPro = false;
        $scope.pwdcfPro = false;
		$scope.ispwdcfPro = false;
		$scope.userdata = [
				{'name': ''},
				{'sex': ''},
				{'birthDate': ''},
				{'idNo': ''},
				{'qualificationNo': ''},
				{'practiceNo': ''},
				{'validDate': ''}
		]
		
		
		$scope.dowzhengshu = function(){
			if(!$scope.PWDisOK) return;
			//$scope.pwdPro = !(/\S/.test($scope.form.password));
           // $scope.pwdcfPro = !(/\S/.test($scope.form.passwordConfirm));
			//if($scope.pwdPro || $scope.pwdcfPro) return;
			
			//http://192.168.1.249:8207/web/inner/v1/prescription/audit/setSignPassword?customerId=324837330433&password=e10adc3949ba59abbe56e057f20f883ee
			var data = {
				'customerId': $scope.doctorId,
				'password': Md5.hex_md5($scope.form.passwordConfirm)
			}
			httpService.linkHttp(apiUrl.setSignPassword, data).then(function(res) {
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
				'customerId': $scope.doctorId
			}
			httpService.linkHttp(apiUrl.doctorInfoQuery, data).then(function(res) {
				// 判断请求成功
				var data = res.data;
				console.log(res);
				if(data.errCode == "000000") {
					
					if(data.data.signPassword==null || data.data.signPassword == "" ) {
						$scope.userdata.name = data.data.name;
						$scope.userdata.sex = data.data.sex == '0'?'男':'女';
						$scope.userdata.birthDate = data.data.birthDate;
						$scope.userdata.idNo = data.data.idNo;
						$scope.userdata.qualificationNo = data.data.qualificationNo;
						$scope.userdata.practiceNo = data.data.practiceNo;
						$scope.userdata.validDate = data.data.validDate;
					}else{
						$state.go('examine.starttrial');
					}
				}else{
					$state.go('login');
				}
			});
		}
		
    }]).name
