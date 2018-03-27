(function(){
  angular.module('myApp', ['io.service'])

  .run(['$rootScope', 'io', function ($rootScope, io) {
    io.init({
      ioServer: 'http://localhost:3696',
    });

    $rootScope.appData = {}
  }])

  .directive('welcome', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'templates/welcome.html',
      scope: {},
      link: function (scope) {
        scope.save = function () {
          angular.extend($rootScope.appData, scope.formData)
        }
      }
    }
  }])

  .directive('chat', ['$rootScope', 'io', function ($rootScope, io) {
    return {
      restrict: 'E',
      templateUrl: 'templates/chat.html',
      scope: {},
      link: function (scope) {
        scope.send = function () {
          if (!scope.message.trim()) {
            return
          }

          io.emit(scope.message);
          scope.message = null;
        }

        io.watch('message', function (data) {
          data.time = moment(data.time).format('L LT')
          scope.lastMessage = data;
          scope.$apply();
        });
      }
    }
  }])
})();