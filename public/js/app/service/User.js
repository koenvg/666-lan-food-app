angular.module('self-service').factory('User', ['$resource',function($resource) {
    return $resource('user/:userId', {}, {
        query: {method:'GET', params:{userId:'users'}, isArray:true},
        'update': { method:'PUT' }
    });
}]);