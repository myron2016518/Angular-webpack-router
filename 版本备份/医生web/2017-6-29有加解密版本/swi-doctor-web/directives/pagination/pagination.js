'use strict';
var template = require('./pagination.html')
require('./css.scss')
module.exports = angular.module('directive.uiPagination', [])
  .directive('uiPagination', function() {
    return {
      restrict: 'EA',
      template: template,
      replace: true,
      scope: {
        conf: '='
      },
      link: function(scope, ele, attrs) {
        var page = scope.page = {};
        var conf = scope.conf;
        // 初始化一页展示多少条  默认为10
        conf.pageLimit = [10, 15, 20, 30, 50];

        if (!conf.itemPageLimit) {
          conf.itemPageLimit = conf.pageLimit[0];
        } else {
          // 把自定义的条目加入到pagelimit中
          if (conf.pageLimit.indexOf(conf.itemPageLimit)) {
            conf.pageLimit.push(conf.itemPageLimit);
            conf.pageLimit = conf.pageLimit.sort(function(a, b) {
              return a - b;
            })
          };
        }

        // 分页数组
        scope.pagePtn = function() {
          if(!scope.conf.success) return false
          conf.httpFun()
          scope.pageList = [];
          if (page.limit < page.defaultLimit) {
            for (var i = 1; i < page.limit + 1; i++) {
              scope.pageList.push(i);
            }
          } else {
            if (conf.currentPage < 4) {
              for (var i = 1; i < 7; i++) {
                scope.pageList.push(i);
              }
              scope.pageList.push('...', page.limit);
            } else if (conf.currentPage >= page.limit - 3) {
              for (var i = page.limit - 3; i <= page.limit; i++) {
                scope.pageList.push(i);
              }
              scope.pageList.unshift(1, '...');
            } else {
              for (var i = conf.currentPage - 2; i < conf.currentPage + 2; i++) {
                scope.pageList.push(i);
              }
              scope.pageList.push('...', page.limit);
              scope.pageList.unshift(1, '...');
            }
          }
          scope.conf.success = false
        }

        scope.pageListFn = function() {
          // 一共多少页
          page.limit = Math.ceil(conf.total / conf.itemPageLimit);

          // 最多展示多少可见页码 默认为10
          page.defaultLimit = conf.defaultLimit ? conf.defaultLimit : 10;

          // 三种打点方式 ， 中间打点， 左边打点， 后边打点
          scope.pagePtn()

        }

        scope.$watch('conf.total+conf.pageNum', function() {
          scope.pageListFn()
        })

        // scope.$watch('conf.pageNum', function() {
        //   scope.pageListFn()
        // })

        // 点击页码
        scope.changePage = function(page) {
          if (!scope.conf.success||page == '...') return;
          conf.currentPage = page;
          scope.pagePtn()
        }

        // 上一页
        scope.prevPage = function() {
          if (!scope.conf.success||conf.currentPage <= 1) return;
          conf.currentPage -= 1;
          scope.pagePtn()
        }

        // 下一页
        scope.nextPage = function() {
          if (!scope.conf.success||conf.currentPage >= page.limit) return false;
          conf.currentPage += 1;
          scope.pagePtn()
        }

        // 改变一页显示条目
        scope.selectPage = function() {}

        // 跳转页
        scope.linkPage = function() {

          if (!Boolean(Number(conf.linkPage))) {
            conf.linkPage = "";
            return;
          }

          if (!conf.linkPage) return;
          conf.linkPage = conf.linkPage.replace(/[^0-9]/, '');
          if (conf.linkPage == 0 || conf.linkPage > page.limit) {
            conf.linkPage = page.limit;
          }
          conf.currentPage = Number(conf.linkPage);
          scope.pagePtn()
          conf.linkPage = ''
        }
      }
    }
  }).name