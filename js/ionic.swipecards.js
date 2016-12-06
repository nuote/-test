(function(ionic) {

  // Get transform origin poly
  var d = document.createElement('div');
  var transformKeys = ['webkitTransformOrigin', 'transform-origin', '-webkit-transform-origin', 'webkit-transform-origin',
              '-moz-transform-origin', 'moz-transform-origin', 'MozTransformOrigin', 'mozTransformOrigin'];

  var TRANSFORM_ORIGIN = 'webkitTransformOrigin';
  for(var i = 0; i < transformKeys.length; i++) {
    if(d.style[transformKeys[i]] !== undefined) {
      TRANSFORM_ORIGIN = transformKeys[i];
      break;
    }
  }

  var transitionKeys = ['webkitTransition', 'transition', '-webkit-transition', 'webkit-transition',
              '-moz-transition', 'moz-transition', 'MozTransition', 'mozTransition'];
  var TRANSITION = 'webkitTransition';
  for(var i = 0; i < transitionKeys.length; i++) {
    if(d.style[transitionKeys[i]] !== undefined) {
      TRANSITION = transitionKeys[i];
      break;
    }
  }

  var SwipeableCardController = ionic.views.View.inherit({
    initialize: function(opts) {
      this.cards = [];

      var ratio = window.innerWidth / window.innerHeight;

      this.maxWidth = window.innerWidth - (opts.cardGutterWidth || 0);
      this.maxHeight = opts.height || 300;
      this.cardGutterWidth = opts.cardGutterWidth || 10;
      this.cardPopInDuration = opts.cardPopInDuration || 400;
      this.cardAnimation = opts.cardAnimation || 'pop-in';
      //console.log(opts);
      //console.log(this.cards);
      //console.log(this.maxWidth);
      //console.log(this.cardGutterWidth);
      //console.log(this.cardPopInDuration);
      //console.log(this.cardAnimation);
    },
    /**
     * Push a new card onto the stack.
     */
    pushCard: function(card) {
      var self = this;

      this.cards.push(card);
      this.beforeCardShow(card);

      card.transitionIn(this.cardAnimation);
      setTimeout(function() {
        card.disableTransition(self.cardAnimation);
      }, this.cardPopInDuration + 100);
    },
    /**
     * Set up a new card before it shows.
     */
    beforeCardShow: function() {
      //console.log(this.cards);
      var nextCard = this.cards[this.cards.length-1];//最后一个card length-1
      if(!nextCard) return;

      // Calculate the top left of a default card, as a translated pos
      var topLeft = window.innerHeight / 2 - this.maxHeight/2;
      //console.log(window.innerHeight, this.maxHeight);
      //console.log(this.cards.length);

      var cardOffset = Math.min(this.cards.length, 3) * 5;
      //console.log(cardOffset);
      // Move each card 5 pixels down to give a nice stacking effect (max of 3 stacked)
      nextCard.setPopInDuration(this.cardPopInDuration);
      nextCard.setZIndex(this.cards.length);
    },
    /**
     * Pop a card from the stack
     */
    popCard: function(animate) {
      //删除card的最后一个元素，把数组长度减 1，并且返回它删除的元素的值
      var card = this.cards.pop();
      console.log(card);
      if(animate) {
        card.swipe();
        console.log(card);
      }
      return card;
    }
  });

  var SwipeableCardView = ionic.views.View.inherit({
    /**
     * Initialize a card with the given options.
     */
    initialize: function(opts) {
      opts = ionic.extend({
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;

      this.startX = this.startY = this.x = this.y = 0;

      this.bindEvents();
    },

    /**
     * Set the X position of the card.
     */
    setX: function(x) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px,' + this.y + 'px, 0)';
      this.x = x;
      this.startX = x;
    },

    /**
     * Set the Y position of the card.
     */
    setY: function(y) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + 'px,' + y + 'px, 0)';
      this.y = y;
      this.startY = y;
    },

    /**
     * Set the Z-Index of the card
     */
    setZIndex: function(index) {
      this.el.style.zIndex = index;
    },

    /**
     * Set the width of the card
     */
    setWidth: function(width) {
      this.el.style.width = width + 'px';
    },

    /**
     * Set the height of the card
     */
    setHeight: function(height) {
      this.el.style.height = height + 'px';
    },

    /**
     * Set the duration to run the pop-in animation
     */
    setPopInDuration: function(duration) {
      this.cardPopInDuration = duration;
    },

    /**
     * Transition in the card with the given animation class
     */
    transitionIn: function(animationClass) {
      var self = this;

      this.el.classList.add(animationClass + '-start');
      this.el.classList.add(animationClass);
      this.el.style.display = 'block';
      setTimeout(function() {
        self.el.classList.remove(animationClass + '-start');
      }, 100);
    },

    /**
     * Disable transitions on the card (for when dragging)
     */
    disableTransition: function(animationClass) {
      this.el.classList.remove(animationClass);
    },

    /**
     * Swipe a card out programtically
     */
    swipe: function() {
      this.transitionOut();
    },

    /**
     * Fly the card out or animate back into resting position.
     */
    transitionOut: function() {
      var self = this;

      if(this.y < 0) {
        this.el.style[TRANSITION] = '-webkit-transform 0.2s ease-in-out';
        this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + ',' + (this.startY) + 'px, 0)';
        setTimeout(function() {
          self.el.style[TRANSITION] = 'none';
        }, 200);
      } else {
        // Fly out
        var rotateTo = (this.rotationAngle + (this.rotationDirection * 0.6)) || (Math.random() * 0.4);
        var duration = this.rotationAngle ? 0.2 : 0.5;
        this.el.style[TRANSITION] = '-webkit-transform ' + duration + 's ease-in-out';
        this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + ',' + (window.innerHeight * 1.5) + 'px, 0) rotate(' + rotateTo + 'rad)';
        this.onSwipe && this.onSwipe();

        // Trigger destroy after card has swiped out
        setTimeout(function() {
          self.onDestroy && self.onDestroy();
        }, duration * 1000);
      }
    },

    /**
     * Bind drag events on the card.
     */
    bindEvents: function() {
      var self = this;
      ionic.onGesture('dragstart', function(e) {
        var cx = window.innerWidth / 2;
        if(e.gesture.touches[0].pageX < cx) {
          self._transformOriginRight();
        } else {
          self._transformOriginLeft();
        }
        ionic.requestAnimationFrame(function() { self._doDragStart(e) });
      }, this.el);

      ionic.onGesture('drag', function(e) {
        ionic.requestAnimationFrame(function() { self._doDrag(e) });
      }, this.el);

      ionic.onGesture('dragend', function(e) {
        ionic.requestAnimationFrame(function() { self._doDragEnd(e) });
      }, this.el);
    },

    // Rotate anchored to the left of the screen
    _transformOriginLeft: function() {
      this.el.style[TRANSFORM_ORIGIN] = 'left center';
      this.rotationDirection = 1;
    },

    _transformOriginRight: function() {
      this.el.style[TRANSFORM_ORIGIN] = 'right center';
      this.rotationDirection = -1;
    },

    _doDragStart: function(e) {
      var width = this.el.offsetWidth;
      var point = window.innerWidth / 2 + this.rotationDirection * (width / 2)
      var distance = Math.abs(point - e.gesture.touches[0].pageX);// - window.innerWidth/2);
      //console.log(distance);

      this.touchDistance = distance * 10;

      //console.log('Touch distance', this.touchDistance);//this.touchDistance, width);
    },

    _doDrag: function(e) {
      var o = e.gesture.deltaY / 3;

      this.rotationAngle = Math.atan(o/this.touchDistance) * this.rotationDirection;

      if(e.gesture.deltaY < 0) {
        this.rotationAngle = 0;
      }

      this.y = this.startY + (e.gesture.deltaY * 0.4);

      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + 'px, ' + this.y  + 'px, 0) rotate(' + (this.rotationAngle || 0) + 'rad)';
    },
    _doDragEnd: function(e) {
      this.transitionOut(e);
    }
  });


  angular.module('ionic.contrib.ui.cards', ['ionic'])

  .directive('swipeCard', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      template: '<div class="swipe-card" ng-transclude></div>',
      require: '^swipeCards',
      //require 可以将其他指令传递给自己 ，如此可以去调用其他的指令的函数和修改其他指令的字段，实现不同指令之间的通信
      // (没有前缀)如果没有前缀，指令将会在自身所提供的控制器中进行查找，如果没有找到任何控制器就抛出一个错误。
      // ? 如果在当前指令中没有找到所需要的控制器，会将null作为传给link函数的第四个参数。
      // ^ 如果添加了^前缀，指令会在上游的指令链中查找require参数所指定的控制器。
      // ?^ 将前面两个选项的行为组合起来，我们可选择地加载需要的指令并在父指令链中进行查找。
      transclude: true,//若设置为true，则保留用户在html中定义的内容。
      //scope : 为当前指令创建一个新的作用域
      //false : 继承父元素的作用域
      //true : 创建一个新的作用域
      // &:作用域把父作用域的属性包装成一个函数，从而以函数的方式读写父作用域的属性
      // =: 作用域的属性与父作用域的属性进行双向绑定，任何一方的修改均会影响到对方
      // @：只能读取父作用域里的值单项绑定
      scope: {
        onCardSwipe: '&',//读写父作用域的属性
        onDestroy: '&'
      },
      //link 函数负责在模型和视图之间进行动态关联
      link: function($scope, $element, $attr, swipeCards) {
        //scope表示controller下面的数据  element表示当前的DOM元素。 attr表示这个DOM元素上的自定义属性。
        var el = $element[0];
        //console.log(el);
        // Instantiate our card view
        var swipeableCard = new SwipeableCardView({
          el: el,
          onSwipe: function() {
            $timeout(function() {
              //对应html on-card-swipe方法
              $scope.onCardSwipe();
            });
          },
          onDestroy: function() {
            $timeout(function() {
              //对应html on-destroy方法
              $scope.onDestroy();
            });
          },
        });
        $scope.$parent.swipeCard = swipeableCard;
        //console.log($scope.$parent.swipeCard);
        //以函数的方式读写父作用域的属性
        swipeCards.swipeController.pushCard(swipeableCard);

      }
    }
  }])

  .directive('swipeCards', ['$rootScope', function($rootScope) {
    return {
      restrict: 'E',
      template: '<div class="swipe-cards" ng-transclude></div>',
      transclude: true,
      scope: true,
      // controller 会暴露一个API ，利用这个API 可以在多个指令之间通过依赖注入进行通信
      controller: function($scope, $element) {
        var swipeController = new SwipeableCardController({
        });

        $rootScope.$on('swipeCard.pop', function(isAnimated) {
          swipeController.popCard(isAnimated); //77
        });

        this.swipeController = swipeController;
        //return swipeController;
      }
    }
  }])

  .factory('$ionicSwipeCardDelegate', ['$rootScope', function($rootScope) {
    return {
      popCard: function($scope, isAnimated) {
        $rootScope.$emit('swipeCard.pop', isAnimated);
      },
      getSwipeableCard: function($scope) {
        return $scope.$parent.swipeCard;
      }
    }
  }]);

})(window.ionic);
