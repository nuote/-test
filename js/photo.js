/**
 * Created by Administrator on 2016/11/28.
 */
angular.module('starter.photo',[])
  .directive('noScroll', function($document) {

    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {

        $document.on('touchmove', function(e) {
          e.preventDefault();
        });
      }
    }
  })

  .controller('ChatsCtrl', function($scope,$ionicSwipeCardDelegate) {

    console.log('a');
    var cardTypes = [{
      title: 'Swipe down to clear the card',
      image: 'img/pic.png'
    }, {
      title: 'Where is this?',
      image: 'img/pic.png'
    }, {
      title: 'What kind of grass is this?',
      image: 'img/pic2.png'
    }, {
      title: 'What beach is this?',
      image: 'img/pic3.png'
    }, {
      title: 'What kind of clouds are these?',
      image: 'img/pic4.png'
    }];

    $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

    $scope.cardSwiped = function(index) {
      $scope.addCard();
    };

    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    };

    $scope.addCard = function() {
      var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      newCard.id = Math.random();
      console.log(newCard);
      $scope.cards.push(angular.extend({}, newCard));
      console.log($scope.cards);
    }

    $scope.goAway = function() {
      $scope.addCard();
      $scope.cards.splice(0, 1);
      //card.swipe();
    };
  });

/*  .controller('ChatsCtrl', function($scope, $ionicSwipeCardDelegate) {

  });*/

