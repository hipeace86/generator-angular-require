define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name <%= scriptAppName %>.controller:SidebarCtrl
     * @description
     * # SidebarCtrl
     * Controller of the <%= scriptAppName %>
     */
    angular.module('<%= scriptAppName %>.controllers.SidebarCtrl', [])
        .controller('SidebarCtrl', function ($scope) {

            $scope.$on('$includeContentLoaded', function () {
                Layout.initSidebar();
            });

            $scope.pageSidebarClosed= false;
        });
});
