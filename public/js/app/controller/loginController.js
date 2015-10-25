'use strict';

angular.module('self-service').controller('LoginController', ['$scope', 'User', '$http', '$location', function ($scope, User, $http,$location) {

    var localMediaStream = null;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var video = document.querySelector('video');


    $scope.attachWebcam = function(){
        if (hasGetUserMedia()) {
            navigator.getUserMedia({video: true}, function(stream) {

                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream;
                // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
                // See crbug.com/110938.
                video.onloadedmetadata = function(e) {
                    // Ready to go. Do some stuff.
                };
            }, function(err){
                console.log('rejected',err)
            });
        } else {
            alert('getUserMedia() is not supported in your browser');
        }
    };
    $scope.register = function(){
        var data_uri =snapshot();
        if(!$scope.name){
            alert('Please enter a name');
        }else{
            var user = new User({
                name: $scope.name,
                image: data_uri
            });
            user.$save(function(u, responseHeaders){
                console.log(u);
            });
        }

    };

    $scope.login = function(){
        var data_uri = snapshot();
        var data = {
            image: data_uri
        };
        $http.post("/login", data).success(function(data, status) {
            window.location.href = '/order';
        });
    };

    function snapshot() {
        if (localMediaStream) {
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;

            ctx.drawImage(video,0,0, 555, 314);
            // "image/webp" works in Chrome.
            // Other browsers will fall back to image/png.
            return canvas.toDataURL('image/png');
        }
    }

}]);

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
}



