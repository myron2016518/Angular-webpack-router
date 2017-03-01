require('../css/index.scss')
define(['../../interrogationModule'], function(module) {
	module.controller("interrogationListCtrl", ['$scope','httpService', function($scope,httpService) {
		'use strict';
		console.log('interrogationPrint');
		$scope.list = [
			{'Serial':1,'Hospital':'深圳第一人民医院','Patient':'狗蛋','Doctor':'张医生','examine':'张医生','mode':'图文','state':"问诊中",'mine':'审核中','time':1488197736,'operation':'详情','id':1},
			{'Serial':2,'Hospital':'深圳第一人民医院','Patient':'狗蛋','Doctor':'张医生','examine':'张医生','mode':'图文','state':"问诊中",'mine':'审核中','time':1488197736,'operation':'详情','id':2},
			{'Serial':3,'Hospital':'深圳第一人民医院','Patient':'狗蛋','Doctor':'张医生','examine':'张医生','mode':'图文','state':"问诊中",'mine':'审核中','time':1488197736,'operation':'详情','id':3},
			{'Serial':4,'Hospital':'深圳第一人民医院','Patient':'狗蛋','Doctor':'张医生','examine':'张医生','mode':'图文','state':"问诊中",'mine':'审核中','time':1488197736,'operation':'详情','id':4},
			{'Serial':5,'Hospital':'深圳第一人民医院','Patient':'狗蛋','Doctor':'张医生','examine':'张医生','mode':'图文','state':"问诊中",'mine':'审核中','time':1488196978,'operation':'详情','id':5},
			{'Serial':6,'Hospital':'深圳第一人民医院','Patient':'狗蛋','Doctor':'张医生','examine':'张医生','mode':'图文','state':"问诊中",'mine':'审核中','time':1488196978,'operation':'详情','id':6}
		]
		console.log($scope.list)

			      $scope.conf = {
			        total : 20,
			        currentPage : 1,
			        itemPageLimit : 1,
			        // 是否显示一页选择多少条
			        isSelectPage : true,
			        // 是否显示快速跳转
			        isLinkPage : false
			      }

			      $scope.$watch('conf.currentPage + conf.itemPageLimit' , function(news){

			         // 把你的http请求放到这里
			         console.log($scope.conf.currentPage , $scope.conf.itemPageLimit)
			      })

	}])
});
