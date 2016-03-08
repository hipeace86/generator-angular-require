define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name <%= scriptAppName %>.controller:HeaderCtrl
     * @description
     * # HeaderCtrl
     * Controller of the <%= scriptAppName %>
     */
    angular.module('<%= scriptAppName %>.controllers.HeaderCtrl', [])
        .controller('HeaderCtrl', function ($scope,$cookies,$state) {
           
            $scope.$on('$includeContentLoaded', function () {
                Layout.initHeader();
            });
            $scope.Login = function() {
                $cookies.remove('user');
                $state.go('login');
            };

        });
});
