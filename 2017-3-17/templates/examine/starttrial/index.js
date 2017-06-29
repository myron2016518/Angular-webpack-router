module.exports = angular.module("app.starttrial")
    .controller("starttrialCtrl", ['$scope', '$state', 'httpService', '$stateParams', '$timeout','$rootScope', 'apiUrl', function($scope, $state, httpService, $stateParams, $timeout,$rootScope,apiUrl) {
	
		

		console.log('这是starttrial:  ')
		$scope.starttrialAction = function(){
			var data = {
                    'doctorId': '217979635127',
                    'doctorName': '林少康',
                    'hospitalId': '',
                    'hospitalName': ''
                }
            	httpService.linkHttp(apiUrl.queryExamineStarttrial,data).then(function(res) {
                        // 判断请求成功
                        var data = res.data;
                       
                        if (data.errCode == "000000") {
                            //var data = data.data;
                             console.log(data);
                            $state.go('examine.triallohandle');
                        }
                        
                    });
                   
			//$state.go('examine.triallohandle');
		}
    }]).name
