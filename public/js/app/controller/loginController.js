'use strict';

angular.module('self-service').controller('LoginController', ['$scope', 'User', function ($scope, User) {

    $scope.test = "banaan";
    Webcam.attach( '#my_camera' );
    $scope.register = function(){
        $scope.test = "lol";

        Webcam.snap( function(data_uri) {
            var test = new User({
                name: "Koen",
                image: data_uri
            });
            test.$save();
            document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
        });
    }

}]);


