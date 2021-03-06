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
        var room = scope.room = $rootScope.appData.room

        if (room) {
          io.init({
            ioServer: 'http://localhost:3696',
            ioRoom: room
          });

          io.subscribe();

          io.emit({
            type: 'info',
            sender: $rootScope.appData.nickname,
            text: $rootScope.appData.nickname + ' joined the room'
          });

          console.log('Joined room ' + room)
        }

        scope.messages = []

        scope.$watchCollection('messages', function () {
          setTimeout(function () {
            document.querySelector('.chat__messages__wrapper').scrollTo(0,document.querySelector('.chat__messages__wrapper').scrollHeight);
          }, 0);
        })

        scope.send = function () {
          if (!scope.message.trim()) {
            return
          }

          io.emit({
            type: 'chat',
            sender: $rootScope.appData.nickname,
            text: scope.message
          });

          scope.messages.push({
            type: 'chat',
            time: moment().format('L LT'),
            sender: 'You',
            text: scope.message,
            self: true
          });

          scope.message = null;
        }

        io.watch('message', function (data) {
          data.time = moment(data.time).format('L LT')
          scope.messages.push(data);
          scope.$apply();
        });
      }
    }
  }])
})();