require('./menuTrees.scss');
define(['../directivesModule'], function(module) {
    module.directive("menuTrees", [function() {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'menuTrees.html',
            // replace: true,
            scope: {
                menuList: '='
            },
            controller: function ($scope, $element) {
                // 控制一级菜单显示
                $scope.toggleDisplay = function (Id) {
                    // 获取所有一级菜单ul
                    var eleArray = document.querySelectorAll("[id^='menu-']");
                    // 当前点击ul
                    var ele = document.querySelector("#menu-" + Id);
                    angular.forEach(eleArray, function(v, k) {
                        v.style.display = "none";
                    })
                    ele.style.display = "block";
                }
                // 执行一次点击展开第一个模块
                setTimeout(function() {
                    document.getElementById("menu-1").click();
                })
            },
            link: function(scope, ele, attrs) {
                // 模块名数组
                scope.FMenuList = [];
                // 一级菜单对象数组
                scope.SMenuList = {};
                // 一级菜单临时数组
                var SArray = [];
                // 遍历获取数组所需字段
                angular.forEach(scope.menuList, function(v, k) {
                    scope.FMenuList[k] = [v.displayOrder, v.menuName, v.menuIcon, v.menuUrl];
                    if (v.childNode.length > 0) {
                        SArray = [];
                        angular.forEach(v.childNode, function(v2, k2) {
                            SArray.push([v2.displayOrder, v2.menuName, v2.menuIcon, v2.menuUrl]);
                        })
                    }
                    scope.SMenuList[k] = SArray;
                })

                // 根据displayOrder重新排序
                function sortNumber(a, b) {
                    return a[0] - b[0];
                };
                scope.FMenuList.sort(sortNumber);
                angular.forEach(scope.SMenuList, function(v, k) {
                        v.sort(sortNumber);
                })
                // console.log(scope.FMenuList);
                // console.log(scope.SMenuList);

            }
        };
    }])
});