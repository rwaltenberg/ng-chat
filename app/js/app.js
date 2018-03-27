angular.module('myApp', ['io.service']).

run(function (io) {
  io.init({
    ioServer: 'http://localhost:3696',
  });

  moment.locale(navigator.language);
}).

controller('MainController', function ($scope, io) {
  $scope.send = function () {
    if (!$scope.message.trim()) {
      return
    }

    io.emit($scope.message);
    $scope.message = null;
  }

  io.watch('message', function (data) {
    data.time = moment(data.time).format('L LT')
    $scope.lastMessage = data;
    $scope.$apply();
  });
});
