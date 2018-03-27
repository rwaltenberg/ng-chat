(function(){
  angular.module('myApp', ['io.service'])

  .run(['$rootScope', 'io', function ($rootScope, io) {
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
        var room = $rootScope.appData.room

        if (room) {
          io.init({
            ioServer: 'http://localhost:3696',
            ioRoom: room
          });

          io.subscribe();
          console.log('Joined room ' + room)
        }

        scope.send = function () {
          if (!scope.message.trim()) {
            return
          }

          io.emit({
            sender: $rootScope.appData.nickname,
            text: scope.message
          });

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