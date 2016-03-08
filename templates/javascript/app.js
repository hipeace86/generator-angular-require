/*jshint unused: vars */
<% if (metronic) {%>
define(['angular', 'controllers/main', 'directives/paging', 'controllers/login', 'controllers/header', 'controllers/sidebar', 'controllers/pagehead', 'controllers/footer', 'services/httpinterceptor', 'controllers/modalinstance', 'services/async', 'directives/ngspinnerbar']/*deps*/, function (angular, MainCtrl, PagingDirective, LoginCtrl, HeaderCtrl, SidebarCtrl, PageHeadCtrl, FooterCtrl, HttpInterceptorFactory, ModalinstanceCtrl, Syncservice, NgSpinnerBarDirective)/*invoke*/ {
<% } else {%>
define(['angular']/*deps*/, function (angular)/*invoke*/ { <% } %>
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
       .module('<%= scriptAppName %>', ['<%= scriptAppName %>.controllers.MainCtrl',<% if (metronic) {%>
       '<%= scriptAppName %>.directives.Paging',
       '<%= scriptAppName %>.controllers.LoginCtrl',
       '<%= scriptAppName %>.controllers.HeaderCtrl',
       '<%= scriptAppName %>.controllers.SidebarCtrl',
       '<%= scriptAppName %>.controllers.PageHeadCtrl',
       '<%= scriptAppName %>.controllers.FooterCtrl',
       '<%= scriptAppName %>.services.HttpInterceptor',
       '<%= scriptAppName %>.controllers.ModalInstanceCtrl',
       '<%= scriptAppName %>.services.Async',
       '<%= scriptAppName %>.directives.NgSpinnerBar',<% } %>
       /*angJSDeps*/<%- angularModules %>])<% if (ngRoute) { %>
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
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
     $urlRouterProvider.otherwise('/');
    })
    .run(function ($rootScope, $state, $stateParams, $cookies) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', function (event, toState, fromState) {
            if (toState.url === '/login') {
                $('body').addClass('login');
            }
            //else {
            //    $('body').removeClass('login');
            //    if ($cookies.get('user') === undefined) {
            //        event.preventDefault();
            //        $state.go('login');
            //    }
            //}
        });
    });
    ;<% }%>
});
