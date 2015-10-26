import '../styles/main.css';
import angular from 'angular';
import { MainAppController } from './main/MainAppController.es';

var eModule = angular.module('app', []).controller('MainAppController',MainAppController);

export default eModule;
