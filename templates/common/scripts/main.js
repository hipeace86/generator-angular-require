/*jshint unused: vars */
require.config({
  paths: {
    angular: '../../asserts/angular/angular'<% if (routeModule) {%>,
    'angular-route': '../../asserts/angular-route/angular-route'<% } %><% if (cookiesModule) {%>,
    'angular-cookies': '../../asserts/angular-cookies/angular-cookies.min'<% } %><% if (sanitizeModule) {%>,
    'angular-sanitize': '../../asserts/angular-sanitize/angular-sanitize.min'<% } %><% if (resourceModule) {%>,
    'angular-resource': '../../asserts/angular-resource/angular-resource.min'<% } %><% if (animateModule) {%>,
    'angular-animate': '../../asserts/angular-animate/angular-animate.min'<% } %><% if (touchModule) {%>,
    'angular-touch': '../../asserts/angular-touch/angular-touch.min'<% } %><% if (uiRouterModule) {%>,
    'angular-ui-router': '../../asserts/angular-ui-router/release/angular-ui-router.min'<% } %>
   },
  shim: {
    'angular' : {'exports' : 'angular'}<% if (routeModule) { %>,
    'angular-route': ['angular']<% } %><% if (cookiesModule) { %>,
    'angular-cookies': ['angular']<% } %><% if (sanitizeModule) { %>,
    'angular-sanitize': ['angular']<% } %><% if (resourceModule) { %>,
    'angular-resource': ['angular']<% } %><% if (animateModule) { %>,
    'angular-animate': ['angular']<% } %><% if (touchModule) { %>,
    'angular-touch': ['angular']<% } %><% if (uiRouterModule) { %>,
    'angular-ui-router':['angular']<% }  %>,
    'angular-mocks': {
      deps:['angular'],
      'exports':'angular.mock'
    }
  },
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'angular',
  'app'<% if (routeModule) { %>,
  'angular-route'<% } %><% if (cookiesModule) { %>,
  'angular-cookies'<% } %><% if (sanitizeModule) { %>,
  'angular-sanitize'<% } %><% if (resourceModule) { %>,
  'angular-resource'<% } %><% if (animateModule) { %>,
  'angular-animate'<% } %><% if (touchModule) { %>,
  'angular-touch'<% } %><% if (uiRouterModule) {%>,
  'angular-ui-router'<% } %>
], function(angular, app<% if (routeModule) { %>, ngRoutes<% } %><% if (cookiesModule) { %>, ngCookies<% } %><% if (sanitizeModule) { %>, ngSanitize<% } %><% if (resourceModule) { %>, ngResource<% } %><% if (animateModule) { %>, ngAnimate<% } %><% if (touchModule) { %>, ngTouch<% } %><% if (uiRouterModule) { %>, uiRouter<% } %>) {
  'use strict';
  /* jshint ignore:start */
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  /* jshint ignore:end */
  angular.element().ready(function() {
    angular.resumeBootstrap([app.name]);
  });
});
