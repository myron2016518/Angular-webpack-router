module.exports = angular.module('filtersModule',[])
    .filter('percentage',[function(){
        return function(input){
            var result=(input*100).toFixed(2)+"%";
            return result;
        }
    }])
    .filter('to_trusted', ['$sce', function ($sce) {
	　　return function (text) {
	    　　return $sce.trustAsHtml(text);
	　　};
	}])
    .filter('cut', function () {
	  return function (value, wordwise, max, tail) {
	    if (!value) return '';
	
	    max = parseInt(max, 10);
	    if (!max) return value;
	    if (value.length <= max) return value;
	
	    value = value.substr(0, max);
	    if (wordwise) {
	      var lastspace = value.lastIndexOf(' ');
	      if (lastspace != -1) {
	        value = value.substr(0, lastspace);
	      }
	    }
	
	    return value + (tail || ' …');
	  };
	}).name
    
    
  
