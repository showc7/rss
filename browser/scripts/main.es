import '../styles/main.css';
import angular from 'angular';
import {
   MainAppController
}
from './main/MainAppController.es';

var app = angular.module('app', []);
var eModule = app.controller('MainAppController', MainAppController);

app.directive('bindHtmlUnsafe', function($parse, $compile) {
   return function($scope, $element, $attrs) {
      var compile = function(newHTML) {
         newHTML = $compile(newHTML)($scope);
         $element.html('').append(newHTML);
      };

      var htmlName = $attrs.bindHtmlUnsafe;

      $scope.$watch(htmlName, function(newHTML) {
         if (!newHTML) return;
         compile(newHTML);
      });

   };
});

export default eModule;
