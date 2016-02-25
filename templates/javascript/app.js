/*jshint unused: vars */
define(['angular']/*deps*/, function (angular)/*invoke*/ {
  'use strict';

  /**
   * @ngdoc overview
   * @name <%= scriptAppName %>
   * @description
   * # <%= scriptAppName %>
   *
   * Main module of the application.
   */
  return angular
    .module('<%= scriptAppName %>', [/*angJSDeps*/<%- angularModules %>])<% if (ngRoute) { %>
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        })
        .otherwise({
          redirectTo: '/'
        });
    })<% } %><% if (uiRouter) {%>
    .config(function ($stateProvider, $urlRouterProvider) {
       // $httpProvider.interceptors.push('httpInterceptor');
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'views/main.html',
            })
     $urlRouterProvider.otherwise('/');
    });<% }%>
});
