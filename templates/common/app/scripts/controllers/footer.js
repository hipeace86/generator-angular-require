define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name <%= scriptAppName %>.controller:FooterCtrl
     * @description
     * # FooterCtrl
     * Controller of the <%= scriptAppName %>
     */
    angular.module('<%= scriptAppName %>.controllers.FooterCtrl', [])
        .controller('FooterCtrl', function ($scope) {
           
            $scope.$on('$includeContentLoaded', function () {
                Layout.initFooter(); // init footer
            });
        });
});
