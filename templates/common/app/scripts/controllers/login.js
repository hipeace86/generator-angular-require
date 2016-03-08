define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name <%= scriptAppName %>.controller:LoginCtrl
     * @description
     * # LoginCtrl
     * Controller of the <%= scriptAppName %>
     */
    angular.module('<%= scriptAppName %>.controllers.LoginCtrl', [])
        .controller('LoginCtrl', function ($scope, $http, $state) {
            
            $scope.Login = function () {
                if ($scope.username !== undefined > 0 && $scope.password !== undefined) {
                    $http.post('/api/rihgt/login', {
                        params:{'user': $scope.username, 'password': $scope.password}
                    }).
                    success(function (data) {
                        switch (data.status){
                            case 200:
                                $scope.alert = {type: 'alert-success', message: '登陆成功'}
                                $state.go('dashboard');
                                break;
                            case 404:
                                $scope.alert = {type: 'alert-danger', message: '帐号密码错误'}
                                break;
                        }
                    });
                } else {
                    $scope.alert = {type: 'alert-danger', message: '请输入帐号密码'}
                }
            }
        });
});
