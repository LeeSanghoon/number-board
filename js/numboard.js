
angular.module('numboard', [])

  .controller('NumBoardCtrl', function ($scope, $interval) {

    // BOARD X and Y size
    $scope.size = 4;

    $scope.sizeArray = [];
    for (var i = 0; i < $scope.size; i++)
      $scope.sizeArray[i] = i;

    $scope.timer = 0;

    var maxNum = $scope.size * $scope.size;

    var board = [];
    for (var i = 0; i < maxNum; i++)
      board[i] = i + 1;

    // empty position
    var eX = $scope.size - 1;
    var eY = $scope.size - 1;

    var edgePos = $scope.size - 1;

    var shuffleInterval;
    var timerInterval;

    var _allMoved = function () {
      for (var i = 0; i < maxNum; i++) {
        if (board[i] == (i + 1))
          return false;
      }
      return true;
    }

    var _shuffle = function () {
      var direction; // l, t, r, b

      if (eX == 0 && eY == 0) {
        direction = Math.floor((Math.random() * 2)) + 2;
      } else if (eX == edgePos && eY == edgePos) {
        direction = Math.floor((Math.random() * 2));
      } else if (eX == 0 && eY == edgePos) {
        direction = Math.floor((Math.random() * 2)) + 1;
      } else if (eX == edgePos && eY == 0) {
        direction = Math.floor((Math.random() * 2));
        if (direction == 1) direction = 3;
      } else if (eX == 0) {
        direction = Math.floor((Math.random() * 3)) + 1;
      } else if (eX == edgePos) {
        direction = Math.floor((Math.random() * 3));
        if (direction == 2) direction = 3;
      } else if (eY == 0) {
        direction = Math.floor((Math.random() * 3));
        if (direction > 0) direction++;
      } else if (eY == edgePos) {
        direction = Math.floor((Math.random() * 3));
      } else {
        direction = Math.floor((Math.random() * edgePos));
      }

      switch (direction) {
        case 0:
          $scope.change(eX - 1, eY, false);
          break;
        case 1:
          $scope.change(eX, eY - 1, false);
          break;
        case 2:
          $scope.change(eX + 1, eY, false);
          break;
        case 3:
          $scope.change(eX, eY + 1, false);
          break;
      }

      if (_allMoved() && angular.isDefined(shuffleInterval)) {
        $interval.cancel(shuffleInterval);
        shuffleInterval = undefined;
      }
    }

    $scope.display = function (x, y) {
      return board[y * $scope.size + x];
    }

    $scope.visibility = function (x, y) {
      if ($scope.display(x, y) == maxNum)
        return 'hidden';
      else
        return 'visible';
    }

    $scope.change = function (toX, toY, showAlert) {
      if (!angular.isDefined(shuffleInterval) && !angular.isDefined(timerInterval)) {
        alert("Shuffle and Start to play!");
        return;
      }
      if (Math.abs(toX - eX) + Math.abs(toY - eY) > 1)
        return;

      var to = board[toY * $scope.size + toX];
      board[toY * $scope.size + toX] = maxNum;
      board[eY * $scope.size + eX] = to;
      eX = toX;
      eY = toY;

      if (showAlert)
        $scope.success(showAlert);
    }

    $scope.success = function (showAlert) {
      for (var i = 0; i < maxNum; i++) {
        if (board[i] != (i + 1)) {
          return false;
        }
      }
      if (showAlert) {
        $interval.cancel(timerInterval);
        timerInterval = undefined;
        alert("Success!");
      }
      return true;
    }

    $scope.shuffle = function () {
      if (angular.isDefined(shuffleInterval)) {
        alert("Shuffling already...");
        return;
      }

      if (angular.isDefined(timerInterval)) {
        $interval.cancel(timerInterval);
        timerInterval = undefined;
      }
      $scope.timer = 0;
      shuffleInterval = $interval(_shuffle, 10);
    }

    $scope.start = function () {
      if (angular.isDefined(shuffleInterval)) {
        alert("Shuffling...");
        return;
      }

      if ($scope.success(false)) {
        alert("Shuffle first!");
        return;
      }

      if (angular.isDefined(timerInterval))
        return;

      timerInterval = $interval(function () {
        $scope.timer++;
      }, 1000);
    }
  });
